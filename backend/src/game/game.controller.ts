import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtTwoFactorGuard } from '../auth/2fa/2fa.guard';
import { CreateGameDto } from './dto/create-game.dto';
import { MatchService } from './match.service';

@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtTwoFactorGuard)
@Controller('game')
export class GameController {
  constructor(private readonly matchService: MatchService) {}

  // Create a new game
  @Post()
  async createGame(@Body() gameDto: CreateGameDto) {
    return this.matchService.createGame(gameDto);
  }

  @Get('/matches')
  async getMatches() {
    return this.matchService.getCurrentMatches();
  }
}
