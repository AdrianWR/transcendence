import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { RequestTypeWithUser, ResponseType } from '../types/auth.interface';
import { RefreshTokenGuard } from './jwt.guard';
import { JwtAuthService } from './jwt.service';

@Controller('auth/jwt')
export class JwtAuthController {
  constructor(private jwtAuthService: JwtAuthService) {}

  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('refresh')
  async refreshTokens(
    @Req() req: RequestTypeWithUser,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const user = req.user;
    const refreshToken = req.cookies?.refreshToken;
    const tokens = await this.jwtAuthService.refreshJwt(user.id, refreshToken);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);

    return user;
  }
}
