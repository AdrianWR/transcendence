import { Controller, Get, HttpCode, HttpStatus, Req, Res, UseGuards } from "@nestjs/common";
import { Request as RequestType, Response as ResponseType } from 'express';
import { JwtAuthService } from "../jwt/jwt.service";
import { GoogleOauthGuard } from "./google-oauth.guard";
import { GoogleOauthService } from "./google-oauth.service";
import { GoogleUserProfile } from "./google-oauth.strategy";

@Controller('auth/google')
export class GoogleOauthController {
  constructor(
    private googleOauthService: GoogleOauthService,
    private jwtAuthService: JwtAuthService,
  ) { }

  @UseGuards(GoogleOauthGuard)
  @Get()
  async auth() { }

  @UseGuards(GoogleOauthGuard)
  @Get('/redirect')
  @HttpCode(HttpStatus.CREATED)
  async googleAuthCallback(@Req() req: RequestType, @Res({ passthrough: true }) res: ResponseType) {
    const tokens = await this.googleOauthService.googleSignIn(req.user as GoogleUserProfile);
    return await this.jwtAuthService.storeTokensInCookie(res, tokens);
  }
}