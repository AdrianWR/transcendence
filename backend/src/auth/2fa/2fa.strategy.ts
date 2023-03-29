import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import authConfig from '../../config/auth.config';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { JwtPayload, RequestType } from '../types/auth.interface';

@Injectable()
export class TwoFactorAuthStrategy extends PassportStrategy(
  Strategy,
  'two-factor',
) {
  constructor(
    @Inject(authConfig.KEY) authConf: ConfigType<typeof authConfig>,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        TwoFactorAuthStrategy.extractAccessJwtFromCookie,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: authConf.jwt.access.secret,
    });
  }

  private static extractAccessJwtFromCookie(req: RequestType): string | null {
    return req.cookies?.accessToken ?? null;
  }

  async validate(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findOne(payload.sub);

    if (!user.mfaEnabled) {
      return user;
    }

    if (payload.mfaAuthenticated) {
      return user;
    }
  }
}
