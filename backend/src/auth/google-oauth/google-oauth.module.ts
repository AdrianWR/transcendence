import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import authConfig from "src/config/auth.config";
import { UsersModule } from "src/users/users.module";
import { JwtAuthModule } from "../jwt/jwt.module";
import { GoogleOauthController } from "./google-oauth.controller";
import { GoogleOauthService } from "./google-oauth.service";
import { GoogleOauthStrategy } from "./google-oauth.strategy";

@Module({
  imports: [
    ConfigModule.forFeature(authConfig),
    PassportModule,
    JwtAuthModule,
    UsersModule
  ],
  providers: [GoogleOauthStrategy, GoogleOauthService],
  controllers: [GoogleOauthController],
  exports: []
})
export class GoogleOauthModule { }