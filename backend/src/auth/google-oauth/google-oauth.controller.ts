import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Request as RequestType, Response as ResponseType } from 'express';
import authConfig from '../../config/auth.config';
import { UsersService } from '../../users/users.service';
import { JwtAuthService } from '../jwt/jwt.service';
import { GoogleOauthGuard } from './google-oauth.guard';
import { GoogleOauthService } from './google-oauth.service';
import { GoogleUserProfile } from './google-oauth.strategy';

@ApiTags('auth')
@Controller('auth/google')
export class GoogleOauthController {
  constructor(
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
    private googleOauthService: GoogleOauthService,
    private jwtAuthService: JwtAuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(GoogleOauthGuard)
  @Get()
  async auth() {}

  @UseGuards(GoogleOauthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/redirect')
  @HttpCode(HttpStatus.CREATED)
  async googleAuthCallback(
    @Req() req: RequestType,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const user = req.user as GoogleUserProfile;
    const tokens = await this.googleOauthService.googleSignIn(user);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);
    res.redirect(`${this.authConf.frontend_url}/login/success`);
    //return this.usersService.findOneByEmail(user.email);
  }
}
