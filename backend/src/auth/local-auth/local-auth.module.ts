import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../../users/users.module";
import { JwtAuthModule } from "../jwt/jwt.module";
import { LocalAuthController } from "./local-auth.controller";
import { LocalAuthService } from "./local-auth.service";
import { LocalStrategy } from "./local.strategy";

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule,
    JwtAuthModule
  ],
  providers: [LocalAuthService, LocalStrategy],
  controllers: [LocalAuthController]
})
export class LocalAuthModule { }