import { Controller, Get, HttpStatus, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleOauthGuard } from './guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() { }

  @Get('google/redirect')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const token = await this.authService.signIn(req.user);

    res.cookie('token', token, {
      maxAge: 2592000000,
      sameSite: true,
      httpOnly: true,
      secure: false,
    });

    return res.status(HttpStatus.OK).send();
  }
}