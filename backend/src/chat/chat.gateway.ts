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
  private connectedUsers = new Map<number, Socket>();
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

    // Store the user id and socket id in a map
    this.connectedUsers.set(userId, client);

    // Fetch the user's chats and join the socket rooms
    const chats = await this.chatService.findChatRoomsByUserId(userId);
    chats.forEach((chat) => client.join(`chat:${chat.id}`));
    client.emit('listChats', chats);

    // Fetch the user's active chat messages and send them to the client
    const messages = await this.chatService.findMessagesByChatId(chats[0].id);
    client.emit('listMessages', messages);
  }

  @SubscribeMessage('listChats')
  async requestChats(
    @SocketUser('id') userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const chats = await this.chatService.findChatRoomsByUserId(userId);
    client.emit('listChats', chats);
  }

  @SubscribeMessage('createChat')
  async createChatRoom(
    @SocketUser('id') userId: number,
    @MessageBody(new ValidationPipe({ transform: true }))
    createChatDto: CreateChatDto,
  ) {
    const chat = await this.chatService.createChatRoom(userId, createChatDto);
    if (!chat) {
      return;
    }

    await Promise.all(
      chat.users.map(async (chatUsers) => {
        const socket = this.connectedUsers.get(chatUsers.user.id);
        if (socket) {
          socket.join(`chat:${chat.id}`);
          const chats = await this.chatService.findChatRoomsByUserId(
            chatUsers.user.id,
          );
          socket.emit('listChats', chats);
        }
      }),
    );
  }

  @SubscribeMessage('createDirectMessage')
  async createDirectMessage(
    @SocketUser('id') userId: number,
    @MessageBody(new ValidationPipe()) friendId: number,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      this.logger.debug(`create dm - ${userId} : ${friendId}`);
      const chat = await this.chatService.createDirectMessageRoom(
        userId,
        friendId,
      );

      await Promise.all(
        chat.users.map(async (chatUsers) => {
          const socket = this.connectedUsers.get(chatUsers.user.id);
          if (socket) {
            socket.join(`chat:${chat.id}`);
            const chats = await this.chatService.findChatRoomsByUserId(
              chatUsers.user.id,
            );
            socket.emit('listChats', chats);
          }
        }),
      );
    } catch (err) {
      client.emit('apiError', err.message);
    }
  }

  @SubscribeMessage('joinChat')
  async joinChat(@MessageBody(new ValidationPipe()) joinChatDto: JoinChatDto) {
    const { chatId, userIds } = joinChatDto;
    const chat = await this.chatService.joinChat(chatId, userIds);

    // Join chat users to the new room
    chat.users.forEach((user) => {
      const socket = this.connectedUsers.get(user.user.id);
      if (socket) {
        socket.join(`chat:${chat.id}`);
      }
    });

    this.server.to(`chat:${chat.id}`).emit('listChats', chat);
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

  @SubscribeMessage('listMessages')
  async listMessages(
    @MessageBody(new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.findMessagesByChatId(chatId);

    // client.emit('listMessages', messages);
    client.emit('listMessages', messages);
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
