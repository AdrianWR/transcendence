import { Logger } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { User } from './entities/user.entity';

interface UserSocketData extends User {
  status: 'online' | 'offline' | 'game' | 'chat';
}

@WebSocketGateway(
  {
    transports: ['websocket'],
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private users: { [id: string]: UserSocketData } = {};
  private readonly logger: Logger = new Logger(UsersGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
    client.join('users')
    this.users[client.id] = {} as UserSocketData;
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
    delete this.users[client.id];
    this.server.emit('usersList', Object.values(this.users));
  }

  @SubscribeMessage('updateUser')
  updateUsers(client: Socket, userData: UserSocketData): void {
    this.logger.debug(`Update user for socket: ${client.id}`);
    this.users[client.id] = userData;
    this.server.emit('usersList', Object.values(this.users));
  }
}
