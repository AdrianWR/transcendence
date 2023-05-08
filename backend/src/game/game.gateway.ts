import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { Interval } from '@nestjs/schedule';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Game } from './entities/game.entity';
import { GameService } from './game.service';

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
  namespace: 'game',
  transports: ['websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  private getConnectionId(client: Socket) {
    return {
      id: client.handshake.auth?.id,
      user: client.handshake.auth?.user,
    };
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const { id, user } = this.getConnectionId(client);

    // Join the client to the game room
    client.join(`game:${id}`);

    // Check if the game exists. If not, send game is finished
    const game = this.gameService.getGameState(id);
    if (!game) {
      client.emit('updateGame', { id, status: 'finished' });
      return;
    }

    // Handle the game connection
    await this.gameService.handleGameConnection(id, user.id);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const { id, user } = this.getConnectionId(client);

    // Check if the game exists. If not, send game is finished
    const game = this.gameService.getGameState(id);
    if (game) {
      this.gameService.handleGameDisconnection(id, user.id);
    }

    client.leave(`game:${id}`);
  }

  @SubscribeMessage('updateGame')
  async updateGame(client: Socket, playerY: number) {
    const { id, user } = this.getConnectionId(client);

    // Update the game state
    await this.gameService.updateFromClient(id, user.id, playerY);
  }

  @SubscribeMessage('pauseGame')
  async pauseGame(client: Socket) {
    const { id, user } = this.getConnectionId(client);

    // Update the game state
    return this.gameService.updateGameState(id, {
      status: 'paused',
    });
  }

  @SubscribeMessage('resumeGame')
  async resumeGame(client: Socket) {
    const { id, user } = this.getConnectionId(client);

    // Update the game state
    return this.gameService.updateGameState(id, {
      status: 'playing',
    });
  }

  @Interval(GameService.FRAME_INTERVAL)
  async handleGameUpdates() {
    // Get all the games
    const games = this.gameService.getCurrentGames();

    // Send the game updates to all the clients
    games.forEach((game) => {
      this.gameService.updateFromServer(game);
      this.server.to(`game:${game.id}`).emit('updateGame', game);
    });
  }

  @OnEvent('match.joined', { async: true })
  async updateGamePlayer(game: Game) {
    // Update the game state
    const gameState = this.gameService.updatePlayerTwo(game.id, {
      id: game.playerTwo.id,
      isConnected: true,
    });

    // Send the game updates to all the clients
    this.server.to(`game:${game.id}`).emit('userJoin', gameState);
  }

  @OnEvent('match.ended', { async: true })
  async handleMatchEnded(game: Game) {
    // Delete the game from memory
    this.gameService.deleteGame(game.id);

    // Send the game updates to all the clients
    this.server.to(`game:${game.id}`).emit('updateGame', game);
  }
}
