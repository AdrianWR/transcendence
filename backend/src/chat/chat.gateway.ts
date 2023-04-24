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
import { UpdateChatDto } from './dto/update-chat.dto';
import { Role, Status } from './entities/chat-users.entity';
import { Chat } from './entities/chat.entity';

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
    if (chats.length > 0) {
      const messages = await this.chatService.findMessagesByChatId(chats[0].id);
      client.emit('listMessages', messages);
    }
  }

  @SubscribeMessage('listChats')
  async listChats(
    @SocketUser('id') userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const chats = await this.chatService.findChatRoomsByUserId(userId);
    client.emit('listChats', chats);

    return chats;
  }

  @SubscribeMessage('listPublicChats')
  async listPublicChats(
    @SocketUser('id') userId: number,
    @ConnectedSocket() client: Socket,
  ) {
    return await this.chatService.findPublicChatRooms(userId);
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
  async joinChat(
    @MessageBody(new ValidationPipe()) joinChatDto: JoinChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    let chat: Chat;

    try {
      // Join chat users to the new room
      const { chatId, userIds } = joinChatDto;
      chat = await this.chatService.joinChat(chatId, userIds);
      await this.listChatsForUsersInTheRoom(chat.id);
    } catch (err) {
      client.emit('apiError', err.message);
      return;
    }

    return chat;
  }

  @SubscribeMessage('updateChat')
  async updateChat(
    @SocketUser('id') userId: number,
    @MessageBody(new ValidationPipe()) updateChatDto: UpdateChatDto,
  ) {
    try {
      await this.chatService.updateChat(updateChatDto);
    } catch (err) {
      return err.message;
    }
    return '';
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
    await this.listChatsForUsersInTheRoom(chatId);
    this.server.to(`chat:${chatId}`).emit('newMessage', newMessage);
  }

  @SubscribeMessage('listMessages')
  async listMessages(
    @MessageBody(new ParseIntPipe()) chatId: number,
    @ConnectedSocket() client: Socket,
  ) {
    const messages = await this.chatService.findMessagesByChatId(chatId);

    client.emit('listMessages', messages);

    return messages;
  }

  @SubscribeMessage('updateMember')
  async muteMember(
    @SocketUser('id') userId: number,
    @MessageBody(new ValidationPipe()) updateMember: UpdateMemberDto,
    @ConnectedSocket() client: Socket,
  ) {
    // Notify the user that they have been modified
    try {
      const chat = await this.chatService.updateMember(
        userId,
        updateMember.chatId,
        updateMember.userId,
        updateMember.role,
        updateMember.status,
      );
      await this.listChatsForUsersInTheRoom(chat.id);
      return chat;
    } catch (err) {
      client.emit('apiError', err.message);
    }

    return await this.chatService.findOne(updateMember.chatId);
  }

  @SubscribeMessage('deleteMember')
  async deleteMember(
    @SocketUser('id') userId: number,
    @MessageBody(new ValidationPipe()) deleteMember: DeleteMemberDto,
    @ConnectedSocket() client: Socket,
  ) {
    // Notify the users in the socket room that the user has been deleted
    try {
      const chat = await this.chatService.deleteMember(
        userId,
        deleteMember.chatId,
        deleteMember.userId,
      );

      // Kick the user out of the room
      const socket = this.connectedUsers.get(deleteMember.userId);
      if (socket) {
        socket.leave(`chat:${deleteMember.chatId}`);
        const chats = await this.chatService.findChatRoomsByUserId(
          deleteMember.userId,
        );
        socket.emit('listChats', chats);
      }

      await this.listChatsForUsersInTheRoom(deleteMember.chatId);
      return chat;
    } catch (err) {
      client.emit('apiError', err.message);
    }

    return true;
  }

  @SubscribeMessage('authenticateChat')
  async authenticateChat(
    @SocketUser('id') userId: number,
    @MessageBody(new ValidationPipe()) authenticateChatDto: AuthenticateChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    try {
      const authenticated = await this.chatService.authenticateChat(
        userId,
        authenticateChatDto.chatId,
        authenticateChatDto.password,
      );

      return authenticated;
    } catch (err) {
      client.emit('apiError', err.message);
    }

    return false;
  }

  async listChatsForUsersInTheRoom(chatId: number) {
    const chat = await this.chatService.findOne(chatId);
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
}

export interface PostMessageDto {
  chatId: number;
  content: string;
}

export interface JoinChatDto {
  chatId: number;
  userIds: number[];
}

export interface PromoteToAdminDto {
  chatId: number;
  userId: number;
}

export interface DemoteToMemberDto {
  chatId: number;
  userId: number;
}

export type UpdateMemberDto = {
  chatId: number;
  userId: number;
  role?: Role;
  status?: Status;
};

export type DeleteMemberDto = {
  chatId: number;
  userId: number;
};

export type AuthenticateChatDto = {
  chatId: number;
  password: string;
};
