import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import authConfig from '../../config/auth.config';
import { AccessTokenGuard } from '../jwt/jwt.guard';
import { JwtAuthService } from '../jwt/jwt.service';
import { RequestTypeWithUser, ResponseType } from '../types/auth.interface';
import { TwoFactorAuthenticationCodeDto } from '../types/two-factor.dto';
import { TwoFactorAuthService } from './2fa.service';

@Controller('auth/2fa')
export class TwoFactorAuthController {
  constructor(
    @Inject(authConfig.KEY) private authConf: ConfigType<typeof authConfig>,
    private jwtAuthService: JwtAuthService,
    private twoFactorAuthService: TwoFactorAuthService,
  ) {}

  @Post('login')
  @HttpCode(200)
  @UseGuards(AccessTokenGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  async authenticate(
    @Req() request: RequestTypeWithUser,
    @Res({ passthrough: true }) response: ResponseType,
    @Body() { code }: TwoFactorAuthenticationCodeDto,
  ) {
    const user = request.user;

    if (!user.mfaEnabled || !user.mfaSecret)
      throw new BadRequestException("User doesn't have 2FA enabled");

    const isCodeValid = this.twoFactorAuthService.isCodeValid(code, user);

    if (!isCodeValid)
      throw new UnauthorizedException('Wrong authentication code');

    const tokens = await this.jwtAuthService.generateJwt(user, true);
    await this.jwtAuthService.storeTokensInCookie(response, tokens);

    return user;
  }

  @Post('generate')
  @UseGuards(AccessTokenGuard)
  async register(
    @Res({ passthrough: true }) response: ResponseType,
    @Req() request: RequestTypeWithUser,
  ) {
    const { otpauthUrl } =
      await this.twoFactorAuthService.generateTwoFactorAuthenticationSecret(
        request.user,
      );

    return otpauthUrl;
  }
}
