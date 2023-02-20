import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-google-oauth20";
import { UsersService } from "src/users/users.service";

type GoogleUserProfile = {
  provider: string,
  providerId: string,
  name: string,
  username: string
  email: string
}

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_SECRET'),
      callbackURL: configService.get<string>('GOOGLE_REDIRECT_URL'),
      scope: ['email', 'profile']
    });
  }

  async validate(_accessToken: string, _refreshToken: string, profile: Profile): Promise<GoogleUserProfile> {
    const { id, name, emails } = profile
    return {
      provider: 'google',
      providerId: id,
      name: name.givenName,
      username: name.givenName,
      email: emails[0].value
    }
  }
}