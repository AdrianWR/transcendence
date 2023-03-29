import { PartialType } from '@nestjs/swagger';
import { FriendDto } from './create-friend.dto';

export class UpdateFriendDto extends PartialType(FriendDto) {}
