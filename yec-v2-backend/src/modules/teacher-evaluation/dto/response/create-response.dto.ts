import { IsUUID, IsString, IsNumber } from 'class-validator';

export class CreateResponseDto {
  @IsUUID()
  questionId: string;

  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsString()
  name: string;

  @IsNumber()
  score: number;
}
