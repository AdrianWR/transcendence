import { IsOptional, IsString, IsInt, IsArray } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  readonly channelName: string;

  @IsInt()
  readonly channelType: number;

  @IsString()
  @IsOptional()
  readonly password?: string | null;

  @IsString()
  readonly channelOwner: string;

  @IsArray()
  channelAdmins: string[];

}
