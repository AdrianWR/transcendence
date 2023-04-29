import { Injectable } from '@nestjs/common';
import { Interval, SchedulerRegistry } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Game } from './entities/game.entity';
import { MatchService } from './match.service';

interface IBall {
  position: {
    x: number;
    y: number;
  };
  velocity: {
    dx: number;
    dy: number;
  };
  diameter: number;
}

interface IPlayer {
  id: number;
  position: {
    x: number;
    y: number;
  };
  length: number;
  thickness: number;
  score: number;
  isConnected: boolean;
}

export interface IGameState {
  id?: string;
  status: 'waiting' | 'playing' | 'paused' | 'finished' | 'idle';
  playerOne: IPlayer;
  playerTwo: IPlayer;
  ball: IBall;
}

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private readonly gameRepository: Repository<Game>,
    private matchService: MatchService,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  // Data structure to store all the game states
  private gameMap = new Map<string, IGameState>();

  getGameState(gameId: string) {
    return this.gameMap.get(gameId);
  }

  getCurrentGames() {
    return this.gameMap;
  }

  async updateGameState(gameId: string, userId: number, playerY: number) {
    // Get the game state
    const gameState = this.gameMap.get(gameId);

    // Check if the game is active
    if (gameState.status !== 'playing') return;

    // If player One, update player One position
    if (gameState.playerOne?.id === userId) {
      gameState.playerOne.position.y = playerY;
    } else if (gameState.playerTwo?.id === userId) {
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

  async createOrSelectGameState(gameId: string) {
    const game = await this.getGame(gameId);

    if (!this.gameMap.has(gameId)) {
      this.gameMap.set(game.id, {
        id: game.id,
        status: 'waiting',
        playerOne: {
          id: game.playerOne.id,
          position: {
            x: 0,
            y: 190,
          },
          thickness: 20,
          length: 120,
          score: game.playerOneScore,
          isConnected: false,
        },
        playerTwo: {
          id: game.playerTwo.id,
          position: {
            x: 780,
            y: 190,
          },
          thickness: 20,
          length: 120,
          score: game.playerTwoScore,
          isConnected: false,
        },
        ball: {
          position: {
            x: 400,
            y: 250,
          },
          velocity: {
            dx: 0,
            dy: 0,
          },
          diameter: 20,
        },
      });
    }

    return this.gameMap.get(game.id);
  }

  async handleGameConnection(gameId: string, userId: number) {
    // Get the game state
    const game = await this.createOrSelectGameState(gameId);

    if (game.playerOne.id === userId) {
      this.gameMap.set(gameId, {
        ...this.gameMap.get(gameId),
        playerOne: {
          ...this.gameMap.get(gameId).playerOne,
          isConnected: true,
        },
      });
    } else if (game.playerTwo.id === userId) {
      this.gameMap.set(gameId, {
        ...this.gameMap.get(gameId),
        playerTwo: {
          ...this.gameMap.get(gameId).playerTwo,
          isConnected: true,
        },
      });
    } else {
      return;
    }

    this.gameMap.set(gameId, {
      ...this.gameMap.get(gameId),
      status: this.isRoomReady(gameId) ? 'idle' : 'waiting',
    });

    if (this.isRoomReady(gameId)) {
      this.schedulerRegistry.addTimeout(
        `game-${gameId}`,
        setTimeout(() => {
          this.startGame(gameId);
          this.schedulerRegistry.deleteTimeout(`game-${gameId}`);
        }, 5000),
      );
    }

    return this.gameMap.get(gameId);
  }

  handleGameDisconnection(gameId: string, userId: number) {
    // Get the game state
    const game = this.getGameState(gameId);

    if (game.playerOne.id === userId) {
      this.gameMap.set(gameId, {
        ...this.gameMap.get(gameId),
        playerOne: {
          ...this.gameMap.get(gameId).playerOne,
          isConnected: false,
        },
      });
    } else if (game.playerTwo.id === userId) {
      this.gameMap.set(gameId, {
        ...this.gameMap.get(gameId),
        playerTwo: {
          ...this.gameMap.get(gameId).playerTwo,
          isConnected: false,
        },
      });
    } else {
      return;
    }

    this.gameMap.set(gameId, {
      ...this.gameMap.get(gameId),
      status: 'playing' ? 'paused' : 'finished',
    });

    return this.gameMap.get(gameId);
  }

  isRoomReady(gameId: string) {
    const game = this.getGameState(gameId);
    return game.playerOne.isConnected && game.playerTwo.isConnected;
  }

  async deleteGame(gameId: string) {
    this.gameMap.delete(gameId);
  }

  async startGame(gameId: string) {
    this.gameMap.set(gameId, {
      ...this.gameMap.get(gameId),
      status: 'playing',
      ball: {
        ...this.gameMap.get(gameId).ball,
        velocity: {
          dx: 3,
          dy: -3,
        },
      },
    });

    return this.gameMap.get(gameId);
  }

  @Interval(1000 / 60)
  async updateGames() {
    for (const game of this.gameMap.values()) {
      if (game.status !== 'playing') continue;

      // Clear the timeout
      // const timeouts = this.schedulerRegistry.getTimeouts();
      // if (timeouts.find((timeout) => timeout === game.id)) {
      //   this.schedulerRegistry.deleteTimeout(game.id);
      // }

      const ball = game.ball;
      const playerOne = game.playerOne;
      const playerTwo = game.playerTwo;

      // Update ball position
      ball.position.x += ball.velocity.dx;
      ball.position.y += ball.velocity.dy;

      // Check if ball is colliding with walls
      if (
        ball.position.y - ball.diameter / 2 < 0 ||
        ball.position.y + ball.diameter / 2 > 500
      ) {
        ball.velocity.dy *= -1;
      }

      // Check if ball is colliding with player one
      if (
        ball.position.x - ball.diameter / 2 < playerOne.thickness &&
        ball.position.y > game.playerOne.position.y &&
        ball.position.y < game.playerOne.position.y + 120
      ) {
        ball.velocity.dx *= -1;
      }

      // Check if ball is colliding with player two
      if (
        ball.position.x + ball.diameter / 2 > 800 - playerTwo.thickness &&
        ball.position.y > game.playerTwo.position.y &&
        ball.position.y < game.playerTwo.position.y + 120
      ) {
        ball.velocity.dx *= -1;
      }

      // Check if ball is out of bounds
      if (ball.position.x < 0 || ball.position.x > 800) {
        // Score for players
        if (ball.position.x < 0) {
          playerTwo.score++;
        } else {
          playerOne.score++;
        }

        // Reset ball position
        ball.position.x = 400;
        ball.position.y = 250;

        // Reset ball velocity
        ball.velocity.dx = 0;
        ball.velocity.dy = 0;

        // Update the game state
        this.gameMap.set(game.id, {
          ...this.gameMap.get(game.id),
          status: 'idle',
        });

        this.schedulerRegistry.addTimeout(
          game.id,
          setTimeout(() => {
            this.gameMap.set(game.id, {
              ...this.gameMap.get(game.id),
              status: 'playing',
              ball: {
                ...this.gameMap.get(game.id).ball,
                velocity: {
                  dx: 3,
                  dy: -3,
                },
              },
            });
            this.schedulerRegistry.deleteTimeout(game.id);
          }, 3000),
        );

        // Update the game in the database
        this.matchService.updateMatch(game.id, {
          playerOneScore: playerOne.score,
          playerTwoScore: playerTwo.score,
        });
      }

      // Update the game state
      this.gameMap.set(game.id, {
        ...this.gameMap.get(game.id),
        ball,
      });
    }
  }
}
