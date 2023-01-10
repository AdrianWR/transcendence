import { Logger } from '@nestjs/common';
import { ConnectedSocket, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private positions = {}
  private readonly frameRate = 30;
  private readonly logger: Logger = new Logger(GameGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.debug(`Client connected: ${client.id}`);
    this.positions[client.id] = { x: 0.5, y: 0.5 };

    setInterval(() => {
      this.server.emit("positions", this.positions);
    }, 1000 / this.frameRate);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    this.logger.debug(`Client disconnected: ${client.id}`);
    delete this.positions[client.id];
  }

  @SubscribeMessage('updatePosition')
  updatePositions(client: Socket, payload: any): void {
    this.logger.debug(`Update position for socket: ${client.id}`)
    this.positions[client.id].x = payload.x;
    this.positions[client.id].y = payload.y;
  }

}
