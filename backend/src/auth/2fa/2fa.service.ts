import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { authenticator } from 'otplib';
import { toFileStream } from 'qrcode';
import authConfig from '../../config/auth.config';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';
import { ResponseType } from '../types/auth.interface';

@Injectable()
export class TwoFactorAuthService {
  constructor(
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
    private readonly usersService: UsersService,
  ) {}

  public async generateTwoFactorAuthenticationSecret(user: User) {
    const secret = authenticator.generateSecret();

    const otpauthUrl = authenticator.keyuri(
      user.email,
      this.authConf.twoFactor.appName,
      secret,
    );

    await this.usersService.setTwoFactorAuthenticationSecret(secret, user.id);

    return {
      secret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: ResponseType, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public isCodeValid(twoFactorAuthenticationCode: string, user: User) {
    return authenticator.verify({
      token: twoFactorAuthenticationCode,
      secret: user.mfaSecret,
    });
  }
}
