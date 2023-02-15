import { Controller, Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {

  @Get('google/login')
  handleLogin() {
    return { msg: 'GoogleAuth' }
  }

  @Get('google/redirect')
  handleRedirect() {
    return { msg: 'OK' }
  }
}
