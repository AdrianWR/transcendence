import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { ApiOAuth2, ApiTags } from "@nestjs/swagger";
import { Request as RequestType, Response as ResponseType } from 'express';
import { JwtAuthService } from "../jwt/jwt.service";
import { FortyTwoOauthGuard } from "./intra.guard";
import { FortyTwoOauthService } from "./intra.service";
import { IntraUserProfile } from "./intra.strategy";

@ApiTags('auth')
@ApiOAuth2([])
@Controller("auth/intra")
export class FortyTwoOauthController {
  constructor(
    private jwtAuthService: JwtAuthService,
    private fortyTwoOauthService: FortyTwoOauthService
  ) { }

  @UseGuards(FortyTwoOauthGuard)
  @Get()
  async fortyTwo() { }

  @UseGuards(FortyTwoOauthGuard)
  @Get('redirect')
  async fortyTwoAuthCallback(@Req() req: RequestType, @Res({ passthrough: true }) res: ResponseType) {
    const tokens = await this.fortyTwoOauthService.fortyTwoSignIn(req.user as IntraUserProfile);
    return await this.jwtAuthService.storeTokensInCookie(res, tokens);
  }
}