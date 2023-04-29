import {
  ClassSerializerInterceptor,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
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
  private static readonly frameRate = 60;
  private readonly logger: Logger = new Logger(GameGateway.name);

  constructor(
    private readonly gameService: GameService,
    private readonly matchService: MatchService,
  ) {}

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

    // Handle the game connection
    await this.gameService.handleGameConnection(id, user.id);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const { id, user } = this.getConnectionId(client);

    // Handle the game disconnection
    this.gameService.handleGameDisconnection(id, user.id);
    client.leave(`game:${id}`);

    // Check if room is empty. If so, delete the game from memory
    // const room = this.server.sockets.adapter?.rooms.get(`game:${id}`);
    // if (!room) {
    //   await this.gameService.deleteGame(id);
    // }
  }

  @SubscribeMessage('updateGame')
  async updateGame(client: Socket, playerY: number) {
    const { id, user } = this.getConnectionId(client);

    // Update the game state
    await this.gameService.updateGameState(id, user.id, playerY);
  }

  @Interval(1000 / GameGateway.frameRate)
  async handleGameUpdates() {
    // Get all the games
    const games = this.gameService.getCurrentGames();

    // Send the game updates to all the clients
    games.forEach(async (game) => {
      this.server.to(`game:${game.id}`).emit('updateGame', game);
    });
  }
}
