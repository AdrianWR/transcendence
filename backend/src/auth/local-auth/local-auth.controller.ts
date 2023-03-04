import { Body, Controller, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ApiCreatedResponse, ApiTags } from "@nestjs/swagger";
import { Request as RequestType, Response as ResponseType } from 'express';
import { CreateUserDto } from "src/users/dto/create-user.dto";
import { User } from "../../users/entities/user.entity";
import { JwtAuthService } from "../jwt/jwt.service";
import { LocalAuthService } from "./local-auth.service";
import { LocalAuthGuard } from "./local.guard";

@ApiTags('auth')
@Controller('auth/local')
export class LocalAuthController {
  constructor(
    private localAuthService: LocalAuthService,
    private jwtAuthService: JwtAuthService,
  ) { }

  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signin(@Req() req: RequestType, @Res({ passthrough: true }) res: ResponseType) {
    const tokens = await this.localAuthService.signIn(req.user as User);
    return await this.jwtAuthService.storeTokensInCookie(res, tokens);
  }

  @ApiCreatedResponse({ description: "User created with local auth method" })
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() createUserDto: CreateUserDto, @Res({ passthrough: true }) res: ResponseType) {
    const tokens = await this.localAuthService.signUp(createUserDto);
    return await this.jwtAuthService.storeTokensInCookie(res, tokens);
  }
}