import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { ChatUsers, Role } from './entities/chat-users.entity';
import { Chat } from './entities/chat.entity';
import { Message } from './entities/message.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat) private readonly chatRepository: Repository<Chat>,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
    @InjectRepository(ChatUsers)
    private readonly chatUsersRepository: Repository<ChatUsers>,
    private readonly usersService: UsersService,
  ) {}

  async findOne(id: number) {
    return await this.chatRepository.findOne({ where: { id: id } });
  }

  async createChatRoom(ownerId: number, createChatDto: CreateChatDto) {
    const users = await Promise.all(
      createChatDto.users.map(async (id) => {
        const user = await this.usersService.findOne(id);
        if (!user) throw new BadRequestException('User does not exist');

        return this.chatUsersRepository.create({
          user: user,
          role: id === ownerId ? Role.OWNER : Role.MEMBER,
        });
      }),
    );

    const chat = this.chatRepository.create({
      ...createChatDto,
      users: users,
    });

    return await this.chatRepository.save(chat);
  }

  async createDirectMessageRoom(userId: number, friendId: number) {
    const users = await Promise.all(
      [userId, friendId].map(async (id) => {
        const user = await this.usersService.findOne(id);
        if (!user) throw new BadRequestException('User does not exist');

        return this.chatUsersRepository.create({
          user: user,
          role: Role.OWNER,
        });
      }),
    );

    const chat = this.chatRepository.create({
      users: users,
    });

    return await this.chatRepository.save(chat);
  }

  async inviteUsersToChatRoom(chatId: number, userIds: number[]) {
    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    const users = await Promise.all(
      userIds.map(async (id) => {
        const user = await this.usersService.findOne(id);
        if (!user) throw new BadRequestException('User does not exist');

        return this.chatUsersRepository.create({
          user: user,
          role: Role.MEMBER,
        });
      }),
    );

    chat.users.push(...users);
    return await this.chatRepository.save(chat);
  }

  async leaveChatRoom(userId: number, chatId: number) {
    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    const user = await this.usersService.findOne(userId);
    if (!user) throw new BadRequestException('User does not exist');

    const isUserInChat = chat.users.some((u) => u.id === userId);
    if (!isUserInChat) throw new BadRequestException('User not in chat room');

    chat.users = chat.users.filter((u) => u.id !== userId);
    return await this.chatRepository.save(chat);
  }

  async sendMessage(userId: number, chatId: number, message: string) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new BadRequestException('User does not exist');

    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    //const isUserInChat = chat.users.some((u) => u.id === userId);
    //if (!isUserInChat) throw new BadRequestException('User not in chat room');

    const newMessage = this.messageRepository.create({
      content: message,
      sender: user,
      chat: chat,
    });

    return await this.messageRepository.save(newMessage);
  }

  // Let the user join the chat room
  async joinChat(chatId: number, userIds: number[]) {
    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    const users = await Promise.all(
      userIds.map(async (id) => {
        const user = await this.usersService.findOne(id);
        if (!user) throw new BadRequestException('User does not exist');

        return this.chatUsersRepository.create({
          user: user,
          role: Role.MEMBER,
        });
      }),
    );

    chat.users.push(...users);
    return await this.chatRepository.save(chat);
  }

  async findChatRoomsByUserId(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new BadRequestException('User does not exist');

    const chats = await this.chatRepository
      .query(`
      select
        chat.id as id,
        chat.name as name,
        chat.type as type,
        chat."createdAt" as "createdAt",
        JSON_AGG(JSON_BUILD_OBJECT(
          'id', users.id,
          'username', users.username,
          'firstName', users."firstName",
          'lastName', users."lastName",
          'email', users.email
        )) as users
      from chat
      JOIN chat_users ON chat_id = chat.id
      JOIN users ON chat_users.user_id = users.id
      WHERE chat.id IN (select chat_id from chat_users where user_id = ${userId})
      GROUP BY chat.id
      `);

    return chats;
  }

  async promoteUser(requesterId: number, chatId: number, userId: number) {
    const role = Role.ADMIN;

    const requester = await this.usersService.findOne(requesterId);
    if (!requester) throw new BadRequestException('Requester does not exist');

    const user = await this.usersService.findOne(userId);
    if (!user) throw new BadRequestException('User does not exist');

    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    const isRequesterInChat = chat.users.some((u) => u.id === requesterId);
    if (!isRequesterInChat)
      throw new BadRequestException('Requester not in chat room');

    const isUserInChat = chat.users.some((u) => u.id === userId);
    if (!isUserInChat) throw new BadRequestException('User not in chat room');

    const requesterRole = chat.users.find((u) => u.id === requesterId).role;
    if (requesterRole !== Role.OWNER && requesterRole !== Role.ADMIN)
      throw new BadRequestException('Requester is not an admin or owner');

    const userRole = chat.users.find((u) => u.id === userId).role;
    if (userRole === Role.OWNER || userRole === Role.ADMIN)
      throw new BadRequestException('User is already an admin or owner');

    chat.users.find((u) => u.id === userId).role = role;
    return await this.chatRepository.save(chat);
  }

  async demoteUser(requesterId: number, chatId: number, userId: number) {
    const role = Role.MEMBER;

    const requester = await this.usersService.findOne(requesterId);
    if (!requester) throw new BadRequestException('Requester does not exist');

    const user = await this.usersService.findOne(userId);
    if (!user) throw new BadRequestException('User does not exist');

    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    const isRequesterInChat = chat.users.some((u) => u.id === requesterId);
    if (!isRequesterInChat)
      throw new BadRequestException('Requester not in chat room');

    const isUserInChat = chat.users.some((u) => u.id === userId);
    if (!isUserInChat) throw new BadRequestException('User not in chat room');

    const requesterRole = chat.users.find((u) => u.id === requesterId).role;
    if (requesterRole !== Role.OWNER && requesterRole !== Role.ADMIN)
      throw new BadRequestException('Requester is not an admin or owner');

    const userRole = chat.users.find((u) => u.id === userId).role;
    if (userRole !== Role.ADMIN)
      throw new BadRequestException('User is not an admin');

    chat.users.find((u) => u.id === userId).role = role;
    return await this.chatRepository.save(chat);
  }

  async findMessagesByChatId(chatId: number) {
    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.chat', 'chat')
      .where('chat.id = :chatId', { chatId: chatId })
      .getMany();
  }
}
