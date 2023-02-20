import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "src/users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleOauthStrategy } from "./strategies/google-oauth.strategy";
import { JwtStrategy } from "./strategies/jwt.strategy";

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        }
      }),
      inject: [ConfigService],
    }),
    ConfigModule
  ],
  providers: [AuthService, JwtStrategy, GoogleOauthStrategy],
  controllers: [AuthController]
})
export class AuthModule { }