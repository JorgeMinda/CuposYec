import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateQuestionDto {
  @IsUUID()
  @IsNotEmpty()
  readonly evaluationId: string;

  @IsString()
  @IsNotEmpty()
  readonly code: string;

  @IsString()
  @IsNotEmpty()
  readonly description: string;

  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsString()
  @IsNotEmpty()
  readonly type: string;
}
