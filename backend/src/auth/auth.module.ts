import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { GoogleOauthModule } from "./google-oauth/google-oauth.module";
import { FortyTwoOauthModule } from "./intra/intra.module";
import { JwtAuthModule } from "./jwt/jwt.module";
import { LocalAuthModule } from "./local-auth/local-auth.module";

@Module({
  imports: [
    UsersModule,
    JwtAuthModule,
    LocalAuthModule,
    GoogleOauthModule,
    FortyTwoOauthModule
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule { }
