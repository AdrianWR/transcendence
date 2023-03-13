import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import authConfig from '../../config/auth.config';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { JwtPayload } from '../types/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY) authConf: ConfigType<typeof authConfig>,
    protected usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractAccessJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: authConf.jwt.access.secret,
    });
  }

  private static extractAccessJwtFromCookie(req: Request): string | null {
    return req.cookies?.accessToken ?? null;
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findOne(payload.sub);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return user;
  }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(authConfig.KEY) authConf: ConfigType<typeof authConfig>,
    protected usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshJwtStrategy.extractRefreshJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: authConf.jwt.refresh.secret,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload): Promise<User> {
    const refreshToken =
      RefreshJwtStrategy.extractRefreshJwtFromBearer(req) ??
      RefreshJwtStrategy.extractRefreshJwtFromCookie(req);

    if (!refreshToken)
      throw new UnauthorizedException('JWT refresh token unavailable');

    const user = await this.usersService.findOne(payload.sub);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return user;
  }

  private static extractRefreshJwtFromBearer(req: Request): string | null {
    return req.get('Authorization')?.replace('Bearer', '').trim();
  }

  private static extractRefreshJwtFromCookie(req: Request): string | null {
    return req.cookies?.refreshToken ?? null;
  }
}
