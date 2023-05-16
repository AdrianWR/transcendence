import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { DeepPartial } from 'typeorm';
import { Game, GameStatus } from './entities/game.entity';
import { MatchService } from './match.service';

type IStatus = 'waiting' | 'ready' | 'playing' | 'paused' | 'finished' | 'idle';

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
  id: string;
  status: IStatus;
  playerOne: IPlayer;
  playerTwo?: IPlayer;
  ball: IBall;
  canvas: {
    width: number;
    height: number;
  };
}

@Injectable()
export class GameService {
  static FRAME_RATE = 60;
  static FRAME_INTERVAL = 1000 / GameService.FRAME_RATE;
  static CANVAS_WIDTH = 800;
  static CANVAS_HEIGHT = 400;
  static BALL_DIAMETER = 20;
  static PLAYER_LENGTH = 100;
  static PLAYER_THICKNESS = 10;
  static PLAYER_SPEED = 10;
  static MAX_SCORE = 3;

  // Data structure to store all the game states
  private gameMap = new Map<string, IGameState>();

  constructor(
    private matchService: MatchService,
    private eventEmitter: EventEmitter2,
  ) {
    // Initialize the game map with all current games
    this.matchService.getCurrentMatches().then((matches) => {
      matches.forEach((match) => {
        this.initGame(match.id);
      });
    });
  }

  @OnEvent('match.created', { async: true })
  async addGame(game: Game) {
    // Create a new game state
    const gameState = await this.initGame(game.id);

    // Update the game state
    this.gameMap.set(game.id, gameState);

    return gameState;
  }

  @OnEvent('match.ended', { async: true })
  async finishGame(game: IGameState) {
    // Remove the game state
    this.gameMap.delete(game.id);

    // Update the match score in the database
    await this.updateMatchScore(
      game.id,
      game.playerOne.score,
      game.playerTwo.score,
    );

    // Finish the game in the database
    await this.matchService.finishMatch(game.id);
  }

  async updateMatchScore(
    gameId: string,
    playerOneScore: number,
    playerTwoScore: number,
  ) {
    // Update the match in the database
    await this.matchService.updateMatch(gameId, {
      playerOneScore,
      playerTwoScore,
    });
  }

  getGameState(gameId: string) {
    return this.gameMap.get(gameId);
  }

  getCurrentGames() {
    return this.gameMap;
  }

  async updateFromClient(
    gameId: string,
    userId: number,
    command: 'up' | 'down',
  ) {
    // Get the game state
    const gameState = this.gameMap.get(gameId);

    // Check if the game is active
    if (gameState?.status !== 'playing') return;

    // If player One, update player One position
    if (gameState.playerOne?.id === userId) {
      const playerY = gameState.playerOne.position.y;

      if (command === 'up') {
        gameState.playerOne.position.y =
          playerY - GameService.PLAYER_SPEED < 0
            ? 0
            : playerY - GameService.PLAYER_SPEED;
      } else if (command === 'down') {
        gameState.playerOne.position.y =
          playerY + GameService.PLAYER_SPEED >
          GameService.CANVAS_HEIGHT - GameService.PLAYER_LENGTH
            ? GameService.CANVAS_HEIGHT - GameService.PLAYER_LENGTH
            : playerY + GameService.PLAYER_SPEED;
      }
    } else if (gameState.playerTwo?.id === userId) {
      // If player Two, update player Two position
      const playerY = gameState.playerTwo.position.y;

      if (command === 'up') {
        gameState.playerTwo.position.y =
          playerY - GameService.PLAYER_SPEED < 0
            ? 0
            : playerY - GameService.PLAYER_SPEED;
      } else if (command === 'down') {
        gameState.playerTwo.position.y =
          playerY + GameService.PLAYER_SPEED >
          GameService.CANVAS_HEIGHT - GameService.PLAYER_LENGTH
            ? GameService.CANVAS_HEIGHT - GameService.PLAYER_LENGTH
            : playerY + GameService.PLAYER_SPEED;
      }
    } else {
      return;
    }

    // Update the game state
    this.gameMap.set(gameId, gameState);

    // Return the updated game state
    return gameState;
  }

  async initGame(gameId: string) {
    const game = await this.matchService.getMatch(gameId);

    if (!this.gameMap.has(gameId)) {
      this.gameMap.set(game.id, {
        id: game.id,
        status: 'waiting',
        playerOne: {
          id: game.playerOne.id,
          position: {
            x: 0,
            y: GameService.CANVAS_HEIGHT / 2 - GameService.PLAYER_LENGTH / 2,
          },
          thickness: GameService.PLAYER_THICKNESS,
          length: GameService.PLAYER_LENGTH,
          score: game.playerOneScore,
          isConnected: false,
        },
        playerTwo: {
          id: game.playerTwo?.id,
          position: {
            x: GameService.CANVAS_WIDTH - GameService.PLAYER_THICKNESS,
            y: GameService.CANVAS_HEIGHT / 2 - GameService.PLAYER_LENGTH / 2,
          },
          thickness: GameService.PLAYER_THICKNESS,
          length: GameService.PLAYER_LENGTH,
          score: game.playerTwoScore,
          isConnected: false,
        },
        ball: {
          position: {
            x: GameService.CANVAS_WIDTH / 2 - GameService.BALL_DIAMETER / 2,
            y: GameService.CANVAS_HEIGHT / 2 - GameService.BALL_DIAMETER / 2,
          },
          velocity: {
            dx: 0,
            dy: 0,
          },
          diameter: GameService.BALL_DIAMETER,
        },
        canvas: {
          width: GameService.CANVAS_WIDTH,
          height: GameService.CANVAS_HEIGHT,
        },
      });
    }

    return this.gameMap.get(game.id);
  }

  updatePlayerTwo(gameId: string, playerTwoState: Partial<IPlayer>) {
    const game = this.gameMap.get(gameId);

    if (game.playerTwo) {
      this.updateGameState(gameId, {
        playerTwo: { ...game.playerTwo, ...playerTwoState },
      });
    } else {
      this.updateGameState(gameId, {
        playerTwo: {
          id: playerTwoState.id,
          position: {
            x: GameService.CANVAS_WIDTH - GameService.PLAYER_THICKNESS,
            y: GameService.CANVAS_HEIGHT / 2 - GameService.PLAYER_LENGTH / 2,
          },
          thickness: GameService.PLAYER_THICKNESS,
          length: GameService.PLAYER_LENGTH,
          score: 0,
          isConnected: false,
        },
      });
    }

    return this.gameMap.get(gameId);
  }

  updateGameState(gameId: string, state: DeepPartial<IGameState>) {
    this.gameMap.set(gameId, <IGameState>{
      ...this.gameMap.get(gameId),
      ...state,
    });
  }

  private updateActivePlayer(
    gameId: string,
    userId: number,
    playerState: Partial<IPlayer>,
  ) {
    const game = this.gameMap.get(gameId);

    if (game.playerOne.id === userId) {
      this.updateGameState(gameId, {
        playerOne: { ...game.playerOne, ...playerState },
      });
    } else if (game.playerTwo.id === userId) {
      this.updateGameState(gameId, {
        playerTwo: { ...game.playerTwo, ...playerState },
      });
    }

    return this.gameMap.get(gameId);
  }

  private updateBall(gameId: string, ballState: Partial<IBall>) {
    this.updateGameState(gameId, {
      ball: { ...this.gameMap.get(gameId).ball, ...ballState },
    });
  }

  private isSpectator(userId: number, gameId: string) {
    const game = this.gameMap.get(gameId);

    return (
      game.playerOne.id !== userId && game.playerTwo.id !== userId && userId
    );
  }

  async handleGameConnection(gameId: string, userId: number) {
    // Get the game state
    //
    if (this.isSpectator(userId, gameId)) {
      return this.getGameState(gameId);
    }

    // Set active player as connected
    this.updateActivePlayer(gameId, userId, { isConnected: true });

    // Check if the game is ready
    if (this.isRoomReady(gameId)) {
      this.startGame(gameId);
    }

    return this.gameMap.get(gameId);
  }

  async handleGameDisconnection(gameId: string, userId: number) {
    if (this.isSpectator(userId, gameId)) {
      return this.getGameState(gameId);
    }

    // Set active player as disconnected
    this.updateActivePlayer(gameId, userId, { isConnected: false });

    // If just one player is connected, pause the game
    // If both players are disconnected, delete the game and abort the match
    const game = this.getGameState(gameId);
    if (game.playerOne.isConnected != game.playerTwo.isConnected) {
      this.pauseGame(gameId);
    } else if (!game.playerOne.isConnected && !game.playerTwo.isConnected) {
      this.deleteGame(gameId);
      await this.matchService.abortMatch(gameId);
    }

    return this.gameMap.get(gameId);
  }

  isRoomReady(gameId: string) {
    const game = this.getGameState(gameId);
    return game.playerOne.isConnected && game.playerTwo.isConnected;
  }

  pauseGame(gameId: string) {
    this.updateGameState(gameId, { status: 'paused' });
  }

  deleteGame(gameId: string) {
    this.gameMap.delete(gameId);
  }

  private getRandomBallVelocity() {
    // Give the ball a random velocity between 4 and 6
    const dx = Math.random() * 2 + 4;
    const dy = Math.random() * 2 + 4;

    return {
      dx: Math.random() > 0.5 ? dx : -dx,
      dy: Math.random() > 0.5 ? dy : -dy,
    };
  }

  async startGame(gameId: string) {
    this.matchService.updateMatch(gameId, {
      status: GameStatus.PLAYING,
    });

    this.updateGameState(gameId, { status: 'playing' });
    this.updateBall(gameId, { velocity: this.getRandomBallVelocity() });

    return this.gameMap.get(gameId);
  }

  updateFromServer(game: IGameState) {
    if (game.status !== 'playing') return;

    const ball = game.ball;
    const playerOne = game.playerOne;
    const playerTwo = game.playerTwo;

    // Update ball position
    ball.position.x += ball.velocity.dx;
    ball.position.y += ball.velocity.dy;

    // Check if ball is colliding with walls
    if (
      ball.position.y - ball.diameter / 2 < 0 ||
      ball.position.y + ball.diameter / 2 > game.canvas.height
    ) {
      ball.velocity.dy *= -1;
    }

    // Check if ball is colliding with player one
    if (
      ball.position.x - ball.diameter / 2 < playerOne.thickness &&
      ball.position.y > playerOne.position.y &&
      ball.position.y < playerOne.position.y + playerOne.length
    ) {
      ball.velocity.dx *= -1;
    }

    // Check if ball is colliding with player two
    if (
      ball.position.x + ball.diameter / 2 >
        game.canvas.width - playerTwo.thickness &&
      ball.position.y > playerTwo.position.y &&
      ball.position.y < playerTwo.position.y + playerTwo.length
    ) {
      ball.velocity.dx *= -1;
    }

    // Check if ball is out of bounds
    if (ball.position.x < 0 || ball.position.x > game.canvas.width) {
      if (ball.position.x < 0) {
        playerTwo.score++;
      } else {
        playerOne.score++;
      }

      // Reset ball position and velocity
      ball.position = {
        x: game.canvas.width / 2,
        y: game.canvas.height / 2,
      };
      ball.velocity = {
        dx: 0,
        dy: 0,
      };

      // this.updateGameState(game.id, { status: 'playing' });
      ball.velocity = this.getRandomBallVelocity();

      // Update the game in the database
      this.updateMatchScore(game.id, playerOne.score, playerTwo.score);
    }

    // Check if match is over
    if (
      playerOne.score >= GameService.MAX_SCORE ||
      playerTwo.score >= GameService.MAX_SCORE
    ) {
      this.eventEmitter.emit('match.ended', { ...game, status: 'finished' });
    }

    // Update the game state
    this.updateGameState(game.id, {
      ball,
      playerOne,
      playerTwo,
    });
  }
}
