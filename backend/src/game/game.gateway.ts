import {
  ClassSerializerInterceptor,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import { MatchService } from './match.service';

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
  private readonly frameRate = 60;
  private readonly logger: Logger = new Logger(GameGateway.name);

  constructor(
    private readonly gameService: GameService,
    private readonly matchService: MatchService,
  ) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(@ConnectedSocket() client: Socket) {
    const gameId = client.handshake.auth?.id;
    const userId = client.handshake.auth?.user.id;

    // Join the client to the game room
    client.join(`game:${gameId}`);

    // Handle the game connection
    await this.gameService.handleGameConnection(gameId, userId);

    setInterval(async () => {
      const game = await this.gameService.getGameState(gameId);
      client.to(`game:${gameId}`).emit('updateGame', game);
    }, 1000 / this.frameRate);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    // Handle the game disconnection
    client.leave(`game:${client.handshake.auth?.id}`);

    this.logger.debug(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('updateGame')
  async updateGame(client: Socket, playerY: number) {
    const gameId = client.handshake.auth?.id;
    const userId = client.handshake.auth?.user.id;

    // Update the game state
    await this.gameService.updateGameState(gameId, userId, playerY);
  }
}
