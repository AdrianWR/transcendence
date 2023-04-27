import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { Game } from './entities/game.entity';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService, MatchService } from './game.service';

@Module({
  imports: [TypeOrmModule.forFeature([Game]), UsersModule],
  providers: [GameGateway, ConfigService, GameService, MatchService],
  controllers: [GameController],
})
export class GameModule {}
