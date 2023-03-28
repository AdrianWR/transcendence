import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly username?: string;

  @IsEmail()
  @IsOptional()
  readonly email?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly firstName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly lastName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly password?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  readonly refreshToken?: string;

  @IsBoolean()
  @IsNotEmpty()
  @IsOptional()
  readonly mfaEnabled?: boolean;
}
