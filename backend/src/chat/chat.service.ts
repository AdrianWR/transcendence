import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { In, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { ChatUsers, Role, Status } from './entities/chat-users.entity';
import { CHAT_TYPE, Chat } from './entities/chat.entity';
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
    return await this.chatRepository.findOne({
      where: { id: id },
      relations: ['users', 'users.user'],
    });
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

    // Check if the owner is in the list of users. If not, add him.
    if (!users.find((user) => user.user.id === ownerId)) {
      users.push(
        this.chatUsersRepository.create({
          user: await this.usersService.findOne(ownerId),
          role: Role.OWNER,
        }),
      );
    }

    const hashedPassword = createChatDto.password
      ? await argon2.hash(createChatDto.password)
      : null;

    const chat = this.chatRepository.create({
      ...createChatDto,
      password: hashedPassword,
      users: users,
    });

    return await this.chatRepository.save(chat);
  }

  async alreadyHaveDirectMessage(userId: number, friendId: number) {
    const userFriendChats = await this.chatUsersRepository.find({
      relations: ['user', 'chat'],
      where: {
        user: { id: In([userId, friendId]) },
        chat: { type: CHAT_TYPE.DIRECT },
      },
    });

    const usersByChatId: { [chatId: number]: number[] } = {};

    return userFriendChats.some(({ user, chat }) => {
      const chatUsers = usersByChatId[chat.id] || [];

      if (chatUsers.length) usersByChatId[chat.id].push(user.id);
      else usersByChatId[chat.id] = [user.id];

      if (chatUsers.length == 2) return true;

      return false;
    });
  }

  async createDirectMessageRoom(userId: number, friendId: number) {
    const hasDM = await this.alreadyHaveDirectMessage(userId, friendId);

    if (hasDM)
      throw new BadRequestException('User already has DM with this friend');

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

    const userStatusInChat = chat.users.find((u) => u.user.id === userId);
    if (userStatusInChat.status === (Status.MUTED || Status.BANNED))
      throw new BadRequestException('User is muted or banned');

    const newMessage = this.messageRepository.create({
      content: message,
      sender: user,
      chat: chat,
    });
    const storedMessage = await this.messageRepository.save(newMessage);

    if (storedMessage) {
      chat.lastMessage = storedMessage.content;
      await this.chatRepository.save(chat);
    }

    return storedMessage;
  }

  // Let the user join the chat room
  async joinChat(chatId: number, userIds: number[]) {
    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    const usersInChat = chat.users.map((u) => u.user.id);
    const usersToJoin = userIds.filter((id) => !usersInChat.includes(id));

    const users = await Promise.all(
      usersToJoin.map(async (id) => {
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

  async updateChat(updateChatDto: UpdateChatDto) {
    const chat = await this.findOne(updateChatDto.id);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    if (updateChatDto.password) {
      const hashedPassword = await argon2.hash(updateChatDto.password);
      updateChatDto.password = hashedPassword;
    }

    return await this.chatRepository.save({
      ...chat,
      password: updateChatDto.password,
    });
  }

  async findChatRoomsByUserId(userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user) throw new BadRequestException('User does not exist');

    const chats = await this.chatRepository.query(`
      select
        chat.id as id,
        chat.name as name,
        chat.type as type,
        chat."createdAt" as "createdAt",
        chat."last_message" as "lastMessage",
        JSON_AGG(JSON_BUILD_OBJECT(
          'id', users.id,
          'username', users.username,
          'firstName', users."firstName",
          'lastName', users."lastName",
          'email', users.email,
          'role', chat_users.role,
          'status', chat_users.status,
          'avatar', 
            (CASE 
                WHEN users.avatar IS NOT NULL 
                THEN CONCAT('${process.env.BACKEND_URL}/${process.env.USER_PICTURE_PATH}/', users.avatar)
                ELSE users.avatar
             END)
        )) as users
      from chat
      JOIN chat_users ON chat_id = chat.id
      JOIN users ON chat_users.user_id = users.id
      WHERE chat.id IN (select chat_id from chat_users where user_id = ${userId})
      GROUP BY chat.id
      ORDER BY chat."updatedAt" DESC
      `);

    return chats;
  }

  async findMessagesByChatId(chatId: number) {
    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    return await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.chat', 'chat')
      .where('chat.id = :chatId', { chatId: chatId })
      .orderBy('message.createdAt', 'ASC')
      .getMany();
  }

  async updateMember(
    requesterId: number,
    chatId: number,
    userId: number,
    role?: Role,
    status?: Status,
  ) {
    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    const isRequesterInChat = chat.users.some((u) => u.user.id === requesterId);
    if (!isRequesterInChat)
      throw new BadRequestException('Requester not in chat room');

    const isUserInChat = chat.users.some((u) => u.user.id === userId);
    if (!isUserInChat) throw new BadRequestException('User not in chat room');

    const requesterRole = chat.users.find(
      (u) => u.user.id === requesterId,
    ).role;
    if (requesterRole !== Role.OWNER && requesterRole !== Role.ADMIN)
      throw new BadRequestException('Requester is not an admin or owner');

    const userRole = chat.users.find((u) => u.user.id === userId).role;
    if (userRole === Role.OWNER)
      throw new BadRequestException('User is an owner');

    const user = chat.users.find((u) => u.user.id === userId);
    if (role) user.role = role;
    if (status) user.status = status;

    return await this.chatRepository.save(chat);
  }

  async deleteMember(requesterId: number, chatId: number, userId: number) {
    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    const isRequesterInChat = chat.users.some((u) => u.user.id === requesterId);
    if (!isRequesterInChat)
      throw new BadRequestException('Requester not in chat room');

    const isUserInChat = chat.users.some((u) => u.user.id === userId);
    if (!isUserInChat) throw new BadRequestException('User not in chat room');

    const requesterRole = chat.users.find(
      (u) => u.user.id === requesterId,
    ).role;
    if (
      requesterRole !== Role.OWNER &&
      requesterRole !== Role.ADMIN &&
      requesterId !== userId
    )
      throw new BadRequestException('Requester is not an admin or owner');

    const userRole = chat.users.find((u) => u.user.id === userId).role;
    if (userRole === Role.OWNER)
      throw new BadRequestException('User is an owner');

    chat.users = chat.users.filter((u) => u.user.id !== userId);
    return await this.chatRepository.save(chat);
  }

  async authenticateChat(userId: number, chatId: number, password: string) {
    const chat = await this.findOne(chatId);
    if (!chat) throw new BadRequestException('Chat room does not exist');

    const isUserInChat = chat.users.some((u) => u.user.id === userId);
    if (!isUserInChat) throw new BadRequestException('User not in chat room');

    const user = await this.usersService.findOne(userId);
    if (!user) throw new BadRequestException('User does not exist');

    const isPasswordCorrect = await argon2.verify(chat.password, password);
    if (!isPasswordCorrect) throw new BadRequestException('Wrong password');

    return true;
  }
}
