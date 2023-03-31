import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtTwoFactorGuard } from '../auth/2fa/2fa.guard';
import { User } from '../users/entities/user.entity';
import { ReqUser } from '../users/users.decorator';
import { CreateFriendRequestDto, FriendDto } from './dto/create-friend.dto';
import { Friend } from './entities/friend.entity';
import { FriendsService } from './friends.service';

@UseGuards(JwtTwoFactorGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('requests')
  async sendFriendRequest(
    @Body() friendRequestDto: CreateFriendRequestDto,
    @ReqUser('id') userId: number,
  ): Promise<FriendDto> {
    const friendId = friendRequestDto.id;

    if (userId === friendId)
      throw new BadRequestException('Users cannot be friends with themselves');

    const friendRequest = await this.friendsService.findBySenderOrRecipient(
      userId,
      friendId,
    );

    if (friendRequest)
      throw new ForbiddenException('Friend request already created');

    return await this.friendsService.store(userId, friendId);
  }

  @Post('requests/:id')
  async acceptFriend(
    @Param('id') friendId: number,
    @ReqUser('id') userId: number,
  ): Promise<Friend> {
    const request = await this.friendsService.findOne(userId, friendId);

    if (!request) throw new NotFoundException('Friend request not found');

    const friendRequest = await this.friendsService.accept(request.id);

    return friendRequest;
  }

  @Delete('requests/:id')
  async rejectFriend(
    @Param('id') friendId: number,
    @ReqUser('id') userId: number,
  ): Promise<void> {
    const request = await this.friendsService.findOne(userId, friendId);

    if (!request) throw new NotFoundException('Friend request not found');

    await this.friendsService.reject(request.id);
  }

  @Get('requests')
  async listFriendsRequests(@ReqUser('id') userId: number): Promise<Friend[]> {
    return await this.friendsService.listRequests(userId);
  }

  @Get()
  async listFriends(@ReqUser('id') userId: number): Promise<User[]> {
    return await this.friendsService.listFriends(userId);
  }
}
