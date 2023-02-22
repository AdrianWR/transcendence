import { Inject } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import authConfig from "../../config/auth.config";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { UsersService } from "../../users/users.service";
import { JwtAuthService } from "../jwt/jwt.service";
import { IntraUserProfile } from "./intra.strategy";

export class FortyTwoOauthService {
  constructor(
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
    private jwtAuthService: JwtAuthService,
    private usersService: UsersService
  ) { }

  async fortyTwoSignIn(profile: IntraUserProfile) {
    let user = await this.usersService.findOneByEmail(profile.email);

    // Check if user is already registered
    if (!user) {
      // throw new ForbiddenException('User already registered');
      const newUser: CreateUserDto = { ...profile }
      user = await this.usersService.create(newUser);
    }

    const tokens = await this.jwtAuthService.getTokens(user);
    await this.jwtAuthService.updateRefreshToken(user, tokens.refreshToken);

    return tokens;
  }

}