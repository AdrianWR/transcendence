import { Controller, UseGuards } from '@nestjs/common';
import { JwtTwoFactorGuard } from '../auth/2fa/2fa.guard';

@UseGuards(JwtTwoFactorGuard)
@Controller('game')
export class GameController {
  constructor() {}
}
