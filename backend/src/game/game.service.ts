import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { Game } from './entities/game.entity';

interface IBall {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    dx: number;
    dy: number;
  };
}

interface IPlayer {
  id?: number;
  position: {
    x: number;
    y: number;
  };
  score: number;
}

export interface IGameState {
  id?: string;
  isActive: boolean;
  playerOne?: IPlayer;
  playerTwo?: IPlayer;
  ball: IBall;
}

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private readonly usersService: UsersService,
  ) {}

  // Data structure to store all the game states
  private gameMap = new Map<string, IGameState>();

  async getGameState(gameId: string) {
    return this.gameMap.get(gameId);
  }

  async updateGameState(gameId: string, userId: number, playerY: number) {
    // Get the game state
    const gameState = this.gameMap.get(gameId);

    // Check if the game is active
    // if (!gameState.isActive) return;

    // If player One, update player One position
    if (gameState.playerOne.id === userId) {
      gameState.playerOne.position.y = playerY;
    } else if (gameState.playerTwo.id === userId) {
      gameState.playerTwo.position.y = playerY;
    } else {
      return;
    }

    // Update the game state
    this.gameMap.set(gameId, gameState);

    // Return the updated game state
    return gameState;
  }

  async getGame(gameId: string) {
    const game = this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerOne', 'playerTwo'],
    });

    if (!game) throw new Error('Game not found');

    return game;
  }

  // Create a new game
  async handleGameConnection(gameId: string, userId: number) {
    // Check if the game exists
    const game = await this.getGame(gameId);
    if (!this.gameMap.has(gameId)) {
      this.gameMap.set(gameId, {
        id: gameId,
        isActive: false,
        playerOne: {
          id: game.playerOne.id,
          position: {
            x: 0,
            y: 190,
          },
          score: game.playerOneScore,
        },
        playerTwo: {
          id: game.playerTwo.id,
          position: {
            x: 780,
            y: 190,
          },
          score: game.playerTwoScore,
        },
        ball: {
          position: {
            x: 0,
            y: 0,
          },
          velocity: {
            dx: 0,
            dy: 0,
          },
        },
      });
    }

    return this.gameMap.get(gameId);
  }

  async startGame(gameId: string) {
    const game = await this.gameRepository.findOne({
      where: { id: gameId },
      relations: ['playerOne', 'playerTwo'],
    });
    if (!game) {
      throw new Error('Game not found');
    }
    if (!game.playerTwo) {
      throw new Error('Game does not have two players');
    }

    this.gameMap.set(gameId, {
      ...this.gameMap.get(gameId),
      isActive: true,
    });

    return game;
  }
}
