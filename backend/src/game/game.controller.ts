import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtTwoFactorGuard } from '../auth/2fa/2fa.guard';
import { MatchService } from './match.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtTwoFactorGuard)
@Controller('matches')
export class GameController {
  constructor(private readonly matchService: MatchService) {}

  @Get()
  async getMatches() {
    return this.matchService.getCurrentMatches();
  }

  @Get('/:id')
  async getMatch(@Param('id', ParseUUIDPipe) id: string) {
    return this.matchService.getMatch(id);
  }
}
