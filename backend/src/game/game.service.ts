import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game } from './entities/game.entity';

interface MatchState {
  ball: {
    x: number;
    y: number;
    dx: number;
    dy: number;
  };
  playerOne: {
    score: number;
    position: number;
  };
  playerTwo: {
    score: number;
    position: number;
  };
  isFinished: boolean;
}

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly usersService: UsersService,
  ) {}

  // Data structure to store all the game states
  private gameMap = new Map<string, MatchState>();

  // Create a new game
}

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly usersService: UsersService,
  ) {}

  async createGame(gameDto: CreateGameDto) {
    const playerOne = await this.usersService.findOne(gameDto.playerOne);
    const playerTwo = await this.usersService.findOne(gameDto.playerTwo);

    const game = this.gameRepository.create({
      playerOne,
      playerTwo,
    });

    return this.gameRepository.save(game);
  }

  async joinGame(gameId: string, userId: number) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerOne', 'playerTwo'],
    });

    if (!game) {
      throw new Error('Game not found');
    }

    if (game.playerTwo) {
      throw new Error('Game already has two players');
    }

    const playerTwo = await this.usersService.findOne(userId);

    game.playerTwo = playerTwo;

    return this.gameRepository.save(game);
  }
}
