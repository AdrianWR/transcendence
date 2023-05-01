import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ReqUser } from '../../users/users.decorator';
import { RequestType, ResponseType } from '../types/auth.interface';
import { RefreshTokenGuard } from './jwt.guard';
import { JwtAuthService } from './jwt.service';

@Controller('auth/jwt')
export class JwtAuthController {
  private readonly logger = new Logger(JwtAuthController.name);
  constructor(private jwtAuthService: JwtAuthService) {}

  @UseGuards(RefreshTokenGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('refresh')
  async refreshTokens(
    @ReqUser() user,
    @Req() req: RequestType,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const refreshToken = req.cookies?.refreshToken;
    try {
      const tokens = await this.jwtAuthService.refreshJwt(
        user.id,
        refreshToken,
      );
      await this.jwtAuthService.storeTokensInCookie(res, tokens);
    } catch (error) {
      this.logger.error(error);
    }

    return user;
  }
}
