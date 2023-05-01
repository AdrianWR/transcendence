import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { ReqUser } from '../../users/users.decorator';
import { ResponseType } from '../types/auth.interface';
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
    @ReqUser() user: User,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    try {
      const tokens = await this.jwtAuthService.refreshJwt(user.id);
      await this.jwtAuthService.storeTokensInCookie(res, tokens);
    } catch (error) {
      this.logger.error(error);
    }

    return user;
  }
}
