import {
  IsDate,
  IsInstance,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../users/entities/user.entity';

export class FriendDto {
  @IsNumber()
  public id: number;

  @IsInstance(User)
  public sender: User;

  @IsInstance(User)
  public recipient: User;

  @IsDate()
  @IsOptional()
  public accepted_date: Date;

  @IsString()
  public status: string;

  @IsDate()
  public createdAt: Date;

  @IsDate()
  public updatedAt: Date;
}

export class CreateFriendRequestDto {
  @IsNumber()
  id: number;
}
