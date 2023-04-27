import {
  ClassSerializerInterceptor,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { instanceToPlain } from 'class-transformer';
import { Server, Socket } from 'socket.io';
import { SocketUser } from '../users/users.decorator';
import { GameService, MatchService } from './game.service';

export const FRONTEND_URL = process.env.FRONTEND_URL;

interface Positions {
  [id: string]: {
    x: number;
    y: number;
  };
}

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly frameRate = 30;
  private readonly logger: Logger = new Logger(GameGateway.name);

  constructor(
    private readonly gameService: GameService,
    private readonly matchService: MatchService,
  ) {}

  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    // setInterval(() => {
    //   this.server.emit('positions', this.positions);
    // }, 1000 / this.frameRate);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    // Abort the game rooms if the user disconnects
  }

  @SubscribeMessage('updateGame')
  async updatePositions(client: Socket, payload: any) {}

  @SubscribeMessage('createGame')
  async createGame(client: Socket, payload: any) {
    const game = await this.matchService.createGame(payload);

    if (game) {
      const currentMatches = instanceToPlain(
        await this.matchService.getCurrentMatches(),
      );
      this.server.emit('listCurrentMatches', currentMatches);
    } else {
      client.emit('apiError', 'Unable to create game');
    }

    return game;
  }

  @SubscribeMessage('joinGame')
  async joinGame(
    @SocketUser('id') userId: number,
    @MessageBody() gameId: string,
  ) {
    const game = await this.matchService.joinGame(gameId, userId);

    if (game) {
      const currentMatches = instanceToPlain(
        await this.matchService.getCurrentMatches(),
      );
      this.server.emit('listCurrentMatches', currentMatches);
    }

    return game;
  }

  @SubscribeMessage('listCurrentMatches')
  async listCurrentMatches(client: Socket, payload: any) {
    return await this.matchService.getCurrentMatches();
  }
}
