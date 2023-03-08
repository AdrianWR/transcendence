import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { Response as ResponseType } from 'express';
import ms from 'ms';
import { UsersService } from 'src/users/users.service';
import authConfig from '../../config/auth.config';
import { User } from '../../users/entities/user.entity';
import { AuthTokenDto } from '../dto/auth-token.dto';
import { JwtPayload } from './jwt.strategy';

@Injectable()
export class JwtAuthService {
  constructor(
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  generateJwt(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  async updateRefreshToken(user: User, refreshToken: string) {
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.usersService.update(user.id, {
      refreshToken: hashedRefreshToken,
    });
  }

  async getTokens(user: User): Promise<AuthTokenDto> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          name: user.username,
          email: user.email,
        },
        {
          secret: this.authConf.jwt.access.secret,
          expiresIn: this.authConf.jwt.access.expires_in,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          name: user.username,
          email: user.email,
        },
        {
          secret: this.authConf.jwt.refresh.secret,
          expiresIn: this.authConf.jwt.refresh.expires_in,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshToken,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokens = await this.getTokens(user);
    await this.updateRefreshToken(user, tokens.refreshToken);
    return tokens;
  }

  async storeTokensInCookie(res: ResponseType, authToken: AuthTokenDto) {
    res.cookie('accessToken', authToken.accessToken, {
      maxAge: +ms(this.authConf.jwt.access.expires_in),
      domain: 'localhost',
      httpOnly: true,
      sameSite: 'lax',
    });
    res.cookie('refreshToken', authToken.refreshToken, {
      maxAge: +ms(this.authConf.jwt.refresh.expires_in),
      domain: 'localhost',
      httpOnly: true,
      sameSite: 'lax',
    });
    return authToken;
  }
}
