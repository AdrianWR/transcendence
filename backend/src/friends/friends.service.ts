import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { FRIEND_STATUS, Friend } from './entities/friend.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    private readonly usersService: UsersService,
  ) {}

  // TODO: Split into received and sent requests
  async listRequests(userId: number): Promise<Friend[]> {
    return await this.friendRepository.find({
      where: [
        { sender: { id: userId }, status: FRIEND_STATUS.PENDING },
        { recipient: { id: userId }, status: FRIEND_STATUS.PENDING },
      ],
      relations: ['sender', 'recipient'],
    });
  }

  async listFriends(userId: number): Promise<User[]> {
    const acceptedFriendRequests = await this.friendRepository.find({
      where: [
        { sender: { id: userId }, status: FRIEND_STATUS.ACCEPTED },
        { recipient: { id: userId }, status: FRIEND_STATUS.ACCEPTED },
      ],
      relations: ['sender', 'recipient'],
    });

    return acceptedFriendRequests.map((request) =>
      request.sender.id !== userId ? request.sender : request.recipient,
    );
  }

  async store(userId: number, friendId: number): Promise<Friend> {
    const friend = new Friend();

    const user = await this.usersService.findOne(userId);
    const futureFriend = await this.usersService.findOne(friendId);

    friend.sender = user;
    friend.recipient = futureFriend;

    await friend.save();

    return friend;
  }

  async accept(id: number): Promise<Friend> {
    const friend_request = await this.friendRepository.findOneBy({ id });

    friend_request.status = FRIEND_STATUS.ACCEPTED;
    friend_request.accepted_date = new Date();

    await friend_request.save();

    return friend_request;
  }

  async reject(id: number): Promise<void> {
    const friendRequest = await this.friendRepository.findOneBy({ id });

    if (!friendRequest)
      throw new NotFoundException(`Friend request Id $(id) not found`);

    await this.friendRepository.remove(friendRequest);
  }

  async findOne(userId: number, friendId: number): Promise<Friend> {
    return await this.friendRepository.findOne({
      where: { recipient: { id: userId }, sender: { id: friendId } },
    });
  }

  async findBySenderOrRecipient(
    userId: number,
    friendId: number,
  ): Promise<Friend> {
    return await this.friendRepository.findOne({
      where: [
        { sender: { id: userId }, recipient: { id: friendId } },
        { sender: { id: friendId }, recipient: { id: userId } },
      ],
    });
  }
}
