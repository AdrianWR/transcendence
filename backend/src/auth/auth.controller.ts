import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request as RequestType, Response as ResponseType } from 'express';
import { AuthService } from './auth.service';
import { AccessTokenGuard } from './jwt/jwt.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AccessTokenGuard)
  @Get('logout')
  async logout(
    @Req() req: RequestType,
    @Res({ passthrough: true }) res: ResponseType,
  ): Promise<void> {
    res.cookie('accessToken', '', { maxAge: -1, httpOnly: true });
    res.cookie('refreshToken', '', { maxAge: -1, httpOnly: true });
    return await this.authService.logout(req.user['sub']);
  }
}
