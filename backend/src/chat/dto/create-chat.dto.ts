import { IsArray, IsOptional, IsString } from 'class-validator';
import { CHAT_TYPE } from '../entities/chat.entity';

export class CreateChatDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  type?: CHAT_TYPE = CHAT_TYPE.DIRECT;

  @IsOptional()
  @IsArray()
  users?: number[] = [];

  @IsOptional()
  @IsString()
  password?: string;
}
