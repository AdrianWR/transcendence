import { Logger } from '@nestjs/common';
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

export const FRONTEND_URL = process.env.FRONTEND_URL;

interface Positions {
  [id: string]: {
    x: number;
    y: number;
  };
}

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

  constructor(private readonly gameService: GameService) {}

  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    // setInterval(() => {
    //   this.server.emit('positions', this.positions);
    // }, 1000 / this.frameRate);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {}

  @SubscribeMessage('updateGame')
  async updatePositions(client: Socket, payload: any) {}
  a;
}
