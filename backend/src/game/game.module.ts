import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Game } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { MatchGateway } from './match.gateway';
import { MatchService } from './match.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), UsersModule],
  providers: [
    GameGateway,
    MatchGateway,
    ConfigService,
    GameService,
    MatchService,
  ],
  controllers: [GameController],
})
export class GameModule {}
