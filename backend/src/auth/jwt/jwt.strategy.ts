import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import authConfig from 'src/config/auth.config';
import { UsersService } from 'src/users/users.service';

export type JwtPayload = {
  sub: number;
  email: string;
  username: string;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: authConf.jwt.access.secret,
    });
  }

  private static extractJwtFromCookie(req: Request): string | null {
    if (req.cookies && 'accessToken' in req.cookies) {
      return req.cookies.accessToken;
    }
    return null;
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    const user = await this.usersService.findOne(payload.sub);

    if (!user) throw new UnauthorizedException('Please log in to continue');

    return {
      sub: payload.sub,
      email: payload.email,
      username: payload.username,
    };
  }
}

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
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

  validate(req: Request, payload: any) {
    const refreshToken =
      RefreshJwtStrategy.extractRefreshJwtFromBearer(req) ??
      RefreshJwtStrategy.extractRefreshJwtFromCookie(req);

    if (!refreshToken)
      throw new UnauthorizedException('JWT refresh token unavailable');

    return { ...payload, refreshToken };
  }

  private static extractRefreshJwtFromBearer(req: Request): string | null {
    return req.get('Authorization')?.replace('Bearer', '').trim();
  }

  private static extractRefreshJwtFromCookie(req: Request): string | null {
    if (req.cookies && 'refreshToken' in req.cookies) {
      return req.cookies.refreshToken;
    }
    return null;
  }
}
