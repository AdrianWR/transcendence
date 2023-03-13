import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import authConfig from 'src/config/auth.config';
import { UsersModule } from 'src/users/users.module';
import { JwtAuthModule } from '../jwt/jwt.module';
import { TwoFactorAuthController } from './2fa.controller';
import { TwoFactorAuthService } from './2fa.service';
import { TwoFactorAuthStrategy } from './2fa.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    PassportModule,
    JwtAuthModule,
    UsersModule,
    HttpModule,
  ],
  providers: [TwoFactorAuthService, TwoFactorAuthStrategy],
  controllers: [TwoFactorAuthController],
  exports: [],
})
export class TwoFactorAuthModule {}
