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
  transports: ['websocket'],
  cors: '*',
})
export class ChatGateway implements OnGatewayConnection {
  private readonly logger = new Logger(ChatGateway.name);

  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  async handleConnection(@ConnectedSocket() client: Socket) {
    const userId = client.handshake.auth?.user?.id;
    if (!userId) {
      client.disconnect();
      return;
    }

    const chats = await this.chatService.findChatRoomsByUserId(userId);

    client.emit('listChats', chats);
  }

  // Join a socket room
  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody(new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(`chat:${chatId}`);

    const messages = await this.chatService.findMessagesByChatId(chatId);
    client.emit('listMessages', messages);
  }

  // Leave a socket room
  @SubscribeMessage('leaveRoom')
  async leaveRoom(
    @MessageBody(new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(`chat:${chatId}`);
  }

  @SubscribeMessage('requestChats')
  async requestChats(
    @SocketUser('id') userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    this.logger.debug('requestChats');
    const chats = await this.chatService.findChatRoomsByUserId(userId);
    client.emit('listChats', chats);
  }

  @SubscribeMessage('createChat')
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
    @ConnectedSocket() client: Socket,
  ) {
    try {
      throw new Error('Erro teste');
      this.logger.debug(`create dm - ${userId} : ${friendId}`);
      await this.chatService.createDirectMessageRoom(
        userId,
        friendId,
      );

      const chats = await this.chatService.findChatRoomsByUserId(userId);

      client.emit('listChats', chats);
    } catch (err) {
      client.emit('apiError', err.message);
    }
  }

  @SubscribeMessage('joinChat')
  async joinChat(@MessageBody(new ValidationPipe()) joinChatDto: JoinChatDto) {
    const { chatId, userIds } = joinChatDto;
    return await this.chatService.joinChat(chatId, userIds);
  }

  @SubscribeMessage('leaveChat')
  async leaveChat(
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
    @SocketUser('id') userId: number,
    @MessageBody(new ValidationPipe()) messageDto: PostMessageDto,
  ) {
    const { chatId, content } = messageDto;
    const newMessage = await this.chatService.sendMessage(
      userId,
      chatId,
      content,
    );
    this.server.to(`chat:${chatId}`).emit('newMessage', newMessage);
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

export interface PostMessageDto {
  chatId: number;
  content: string;
}

export interface JoinChatDto {
  chatId: number;
  userIds: number[];
}
