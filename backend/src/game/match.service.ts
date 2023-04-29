import { Injectable } from '@nestjs/common';
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
  ) {}

  async createGame(gameDto: CreateGameDto) {
    const playerOne = await this.usersService.findOne(gameDto.playerOne);
    const playerTwo = gameDto.playerTwo
      ? await this.usersService.findOne(gameDto.playerTwo)
      : null;

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

  async getCurrentMatches() {
    return this.gameRepository.find({
      where: { status: GameStatus.WAITING || GameStatus.PLAYING },
      order: { createdAt: 'ASC' },
      relations: ['playerOne', 'playerTwo'],
    });
  }
}
