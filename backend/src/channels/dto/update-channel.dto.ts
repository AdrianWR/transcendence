import { PartialType } from '@nestjs/mapped-types';
import { CreateChannelDto } from './create-channel.dto';
import { IsString, IsBoolean, IsOptional } from 'class-validator';

export class UpdateChannelDto extends PartialType(CreateChannelDto) {}
