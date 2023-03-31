import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import authConfig from '../../config/auth.config';
import { UsersModule } from '../../users/users.module';
import { JwtAuthController } from './jwt.controller';
import { JwtAuthService } from './jwt.service';
import { JwtStrategy, RefreshJwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(authConfig)],
      useFactory: async (authConfigService: ConfigType<typeof authConfig>) => ({
        secret: authConfigService.jwt.access.secret,
        signOptions: {
          expiresIn: authConfigService.jwt.access.expires_in,
        },
      }),
      inject: [authConfig.KEY],
    }),
  ],
  providers: [JwtAuthService, JwtStrategy, RefreshJwtStrategy],
  controllers: [JwtAuthController],
  exports: [JwtAuthService],
})
export class JwtAuthModule {}
