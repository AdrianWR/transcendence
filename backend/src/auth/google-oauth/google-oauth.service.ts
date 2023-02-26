import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { UsersService } from "src/users/users.service";
import { JwtAuthService } from "../jwt/jwt.service";
import { GoogleUserProfile } from "./google-oauth.strategy";

@Injectable()
export class GoogleOauthService {
  constructor(
    private jwtAuthService: JwtAuthService,
    private usersService: UsersService
  ) { }

  async googleSignIn(profile: GoogleUserProfile) {
    // const username = profile.email.match(/^(.+)@/)[1]
    let user = await this.usersService.findOneByEmail(profile.email);

    // Create new user if not registered
    if (!user) {
      const newUser: CreateUserDto = { ...profile }
      user = await this.usersService.create(newUser);
    }

    const tokens = await this.jwtAuthService.getTokens(user);
    await this.jwtAuthService.updateRefreshToken(user, tokens.refreshToken);

    return tokens;
  }
}