import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { CookieOptions } from 'express';
import ms from 'ms';
import authConfig from '../../config/auth.config';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { AuthTokenDto } from '../types/auth-token.dto';
import { JwtPayload, ResponseType } from '../types/auth.interface';

@Injectable()
export class JwtAuthService {
  constructor(
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  private domain = new URL(this.authConf.backend_url)?.hostname;

  private cookieOptions: CookieOptions = {
    domain: this.domain,
    httpOnly: true,
    sameSite: this.domain !== 'localhost' ? 'none' : 'lax',
    secure: this.domain !== 'localhost',
  };

  private async updateRefreshToken(user: User, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });
  }

  generateJwtPayload(user: User, mfaAuthenticated: boolean): JwtPayload {
    return {
      sub: user.id,
      username: user.username,
      email: user.email,
      mfaEnabled: user.mfaEnabled,
      mfaAuthenticated: mfaAuthenticated,
    };
  }

  async generateJwt(
    user: User,
    mfaAuthenticated: boolean = true,
  ): Promise<AuthTokenDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        this.generateJwtPayload(user, mfaAuthenticated),
        {
          secret: this.authConf.jwt.access.secret,
          expiresIn: this.authConf.jwt.access.expires_in,
        },
      ),
      this.jwtService.signAsync(
        this.generateJwtPayload(user, mfaAuthenticated),
        {
          secret: this.authConf.jwt.refresh.secret,
          expiresIn: this.authConf.jwt.refresh.expires_in,
        },
      ),
    ]);

    await this.updateRefreshToken(user, refreshToken);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshJwt(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new ForbiddenException('Access Denied: User not found');
    }

    // This allow us refresh token rotation
    return await this.generateJwt(user);
  }

  async storeTokensInCookie(res: ResponseType, authToken: AuthTokenDto) {
    res.cookie('accessToken', authToken.accessToken, {
      maxAge: +ms(this.authConf.jwt.access.expires_in),
      ...this.cookieOptions,
    });
    res.cookie('refreshToken', authToken.refreshToken, {
      maxAge: +ms(this.authConf.jwt.refresh.expires_in),
      ...this.cookieOptions,
    });
    return authToken;
  }
}
