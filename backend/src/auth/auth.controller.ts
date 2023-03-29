import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response as ResponseType } from 'express';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './jwt/jwt.guard';
import { RequestTypeWithUser } from './types/auth.interface';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(
    @Req() req: RequestTypeWithUser,
    @Res({ passthrough: true }) res: ResponseType,
  ): Promise<void> {
    res.cookie('accessToken', '', { maxAge: -1, httpOnly: true });
    res.cookie('refreshToken', '', { maxAge: -1, httpOnly: true });
    return await this.authService.logout(req.user['id']);
  }
}
