import { IsNumber, IsOptional } from 'class-validator';

export class CreateGameDto {
  @IsNumber()
  playerOne: number;

  @IsNumber()
  @IsOptional()
  playerTwo: number;
}
