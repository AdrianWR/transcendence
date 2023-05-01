import { ClassSerializerInterceptor, UseInterceptors } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { instanceToPlain } from 'class-transformer';
import { Server, Socket } from 'socket.io';
import { SocketUser } from '../users/users.decorator';
import { MatchService } from './match.service';

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})
export class MatchGateway {
  constructor(private readonly matchService: MatchService) {}

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('createGame')
  async createGame(client: Socket, payload: any) {
    const game = await this.matchService.createMatch(payload);

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
    const game = await this.matchService.joinMatch(gameId, userId);

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
