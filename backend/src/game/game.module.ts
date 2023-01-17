import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GameGateway } from './game.gateway';

@Module({
    providers: [GameGateway, ConfigService],
})
export class GameModule { }
