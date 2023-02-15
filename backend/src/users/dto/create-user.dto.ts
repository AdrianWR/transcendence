import { IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  readonly user: string;

  @IsString()
  readonly email: string;

  @IsString()
  readonly password: string;
}
