import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";
import { Request as RequestType, Response as ResponseType } from 'express';
import { RefreshTokenGuard } from "./jwt.guard";
import { JwtAuthService } from "./jwt.service";


@Controller('auth/jwt')
export class JwtAuthController {
  constructor(
    private jwtAuthService: JwtAuthService,
  ) { }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  async refreshTokens(@Req() req: RequestType, @Res({ passthrough: true }) res: ResponseType) {
    const userId = req.user['sub']
    const refreshToken = req.user['refreshToken'] || req.cookies.refresh_token;
    const tokens = await this.jwtAuthService.refreshTokens(userId, refreshToken);
    return await this.jwtAuthService.storeTokensInCookie(res, tokens);
  }
}