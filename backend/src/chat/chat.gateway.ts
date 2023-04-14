import {
  ClassSerializerInterceptor,
  Logger,
  ParseIntPipe,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketUser } from '../users/users.decorator';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';

@UseInterceptors(ClassSerializerInterceptor)
@WebSocketGateway({
  namespace: 'chat',
  transports: ['websocket'],
  cors: '*',
})
export class ChatGateway implements OnGatewayConnection {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    this.logger.debug(`Socket connected: ${client.id}`);
    const rooms = await this.chatService.findChatRoomsByUserId(9);
    this.server.emit('listRooms', rooms);
  }

  @SubscribeMessage('requestRooms')
  async requestRooms(
    @SocketUser('id') userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.debug('requestRooms');
    const rooms = await this.chatService.findChatRoomsByUserId(userId);
    client.emit('listRooms', rooms);
  }

  @SubscribeMessage('createChatRoom')
  async createChatRoom(
    @SocketUser('id') userId: number,
    @MessageBody(new ValidationPipe({ transform: true }))
    createChatDto: CreateChatDto,
  ) {
    return this.chatService.createChatRoom(userId, createChatDto);
  }

  @SubscribeMessage('createDirectMessage')
  async createDirectMessage(
    @SocketUser('id') userId: number,
    @MessageBody(new ValidationPipe()) friendId: number,
  ) {
    const chat = await this.chatService.createDirectMessageRoom(
      userId,
      friendId,
    );
    return chat;
  }

  @SubscribeMessage('listRooms')
  async listRooms(@SocketUser('id') userId: number) {
    this.logger.debug('listRooms');
    return await this.chatService.findChatRoomsByUserId(userId);
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(
    @SocketUser('id') userId: number,
    @MessageBody(new ParseIntPipe()) chatId: number,
  ) {
    return await this.chatService.joinChatRoom(userId, chatId);
  }

  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @SocketUser('id') userId: number,
    @MessageBody(new ParseIntPipe()) chatId: number,
  ) {
    return await this.chatService.leaveChatRoom(userId, chatId);
  }

  @SubscribeMessage('inviteUsers')
  async inviteUsers(
    @SocketUser('id') userId: number,
    @MessageBody(new ParseIntPipe()) chatId: number,
    @MessageBody(new ValidationPipe()) userIds: number[],
  ) {
    return await this.chatService.inviteUsersToChatRoom(chatId, userIds);
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @SocketUser('id') userId: number,
    @MessageBody(new ParseIntPipe()) chatId: number,
    @MessageBody(new ValidationPipe()) message: string,
  ) {
    const newMessage = await this.chatService.sendMessage(
      userId,
      chatId,
      message,
    );
    return client.to(chatId.toString()).emit('newMessage', newMessage);
  }

  @SubscribeMessage('promoteUser')
  async promoteUser(
    @SocketUser('id') userId: number,
    @MessageBody(new ParseIntPipe()) chatId: number,
    @MessageBody(new ParseIntPipe()) userIdToPromote: number,
  ) {
    return await this.chatService.promoteUser(userId, chatId, userIdToPromote);
  }

  @SubscribeMessage('demoteUser')
  async demoteUser(
    @SocketUser('id') userId: number,
    @MessageBody(new ParseIntPipe()) chatId: number,
    @MessageBody(new ParseIntPipe()) userIdToDemote: number,
  ) {
    return await this.chatService.demoteUser(userId, chatId, userIdToDemote);
  }
}
