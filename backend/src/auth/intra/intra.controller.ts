import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Inject,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ApiOAuth2, ApiTags } from '@nestjs/swagger';
import { Request as RequestType, Response as ResponseType } from 'express';
import authConfig from '../../config/auth.config';
import { UsersService } from '../../users/users.service';
import { JwtAuthService } from '../jwt/jwt.service';
import { FortyTwoOauthGuard } from './intra.guard';
import { FortyTwoOauthService } from './intra.service';
import { IntraUserProfile } from './intra.strategy';

@ApiTags('auth')
@ApiOAuth2([])
@Controller('auth/intra')
export class FortyTwoOauthController {
  constructor(
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
    private jwtAuthService: JwtAuthService,
    private fortyTwoOauthService: FortyTwoOauthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(FortyTwoOauthGuard)
  @Get()
  async fortyTwo() {}

  @UseGuards(FortyTwoOauthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('redirect')
  async fortyTwoAuthCallback(
    @Req() req: RequestType,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const user = req.user as IntraUserProfile;
    const tokens = await this.fortyTwoOauthService.fortyTwoSignIn(user);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);

    res.redirect(`${this.authConf.frontend_url}/login/success`);
  }
}
