import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { Request as RequestType, Response as ResponseType } from 'express';
import { User } from '../../users/entities/user.entity';
import { CreateUserDto } from '../../users/types/create-user.dto';
import { UsersService } from '../../users/users.service';
import { JwtAuthService } from '../jwt/jwt.service';
import { LocalAuthService } from './local-auth.service';
import { LocalAuthGuard } from './local.guard';

@ApiTags('auth')
@Controller('auth/local')
export class LocalAuthController {
  constructor(
    private localAuthService: LocalAuthService,
    private jwtAuthService: JwtAuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signin')
  async signin(
    @Req() req: RequestType,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const user = req.user as User;
    const tokens = await this.localAuthService.signIn(user);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);
    return this.usersService.findOne(user.id);
  }

  @ApiCreatedResponse({ description: 'User created with local auth method' })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('signup')
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: ResponseType,
  ) {
    const tokens = await this.localAuthService.signUp(createUserDto);
    await this.jwtAuthService.storeTokensInCookie(res, tokens);
    return this.usersService.findOneByEmail(createUserDto.email);
  }
}
