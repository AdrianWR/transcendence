import { Injectable } from '@nestjs/common';
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';



@Injectable()
@WebSocketGateway({
  transports: ['websocket'],
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(@MessageBody() message: string): void {
    this.server.emit(' message', message)
  }
}
