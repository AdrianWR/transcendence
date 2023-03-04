import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from "passport-google-oauth20";
import authConfig from "src/config/auth.config";

export type GoogleUserProfile = {
  provider: string,
  username: string
  email: string,
  first_name: string,
  last_name: string,
  picture: string,
  accessToken?: string,
  refreshToken?: string
}

@Injectable()
export class GoogleOauthStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(authConfig.KEY) authConf: ConfigType<typeof authConfig>
  ) {
    super({
      clientID: authConf.google.client_id,
      clientSecret: authConf.google.secret,
      callbackURL: authConf.google.redirect_url,
      scope: ['email', 'profile']
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback): Promise<any> {
    const { name, emails, photos, } = profile
    const user: GoogleUserProfile = {
      provider: 'google',
      username: name.givenName,
      email: emails[0].value,
      first_name: name.givenName,
      last_name: name.familyName,
      picture: photos[0].value,
      accessToken,
      refreshToken,
    }
    done(null, user);
  }
}