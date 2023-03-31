import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import authConfig from '../../config/auth.config';
import { UsersModule } from '../../users/users.module';
import { JwtAuthModule } from '../jwt/jwt.module';
import { FortyTwoOauthController } from './intra.controller';
import { FortyTwoOauthService } from './intra.service';
import { FortyTwoOauthStrategy } from './intra.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    PassportModule,
    JwtAuthModule,
    UsersModule,
    HttpModule,
  ],
  providers: [FortyTwoOauthStrategy, FortyTwoOauthService],
  controllers: [FortyTwoOauthController],
  exports: [],
})
export class FortyTwoOauthModule {}
