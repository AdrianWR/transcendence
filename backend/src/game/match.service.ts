import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateGameDto } from './dto/create-game.dto';
import { Game, GameStatus } from './entities/game.entity';

@Injectable()
export class MatchService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly usersService: UsersService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createGame(gameDto: CreateGameDto) {
    const playerOne = await this.usersService.findOne(gameDto.playerOne);
    const playerTwo = gameDto.playerTwo
      ? await this.usersService.findOne(gameDto.playerTwo)
      : null;

    const newGame = this.gameRepository.create({
      playerOne,
      playerTwo,
    });

    const game = await this.gameRepository.save(newGame);

    this.eventEmitter.emit('match.created', game);

    return game;
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

  // this.matchService.updateGame(game.id, {
  //   playerOneScore: playerOne.score,
  //   playerTwoScore: playerTwo.score,
  // });

  async updateMatch(gameId: string, gameDto: Partial<Game>) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerOne', 'playerTwo'],
    });

    if (!game) {
      throw new Error('Game not found');
    }

    const updatedGame = this.gameRepository.merge(game, gameDto);

    return this.gameRepository.save(updatedGame);
  }

  async getCurrentMatches() {
    return this.gameRepository.find({
      where: { status: GameStatus.WAITING || GameStatus.PLAYING },
      order: { createdAt: 'ASC' },
      relations: ['playerOne', 'playerTwo'],
    });
  }

  async getMatch(gameId: string) {
    return this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerOne', 'playerTwo'],
    });
  }
}
