import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly refreshToken?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly mfaEnabled?: boolean;
}
