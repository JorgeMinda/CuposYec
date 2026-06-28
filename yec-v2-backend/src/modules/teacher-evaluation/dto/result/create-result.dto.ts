import { IsString, IsUUID, IsOptional } from 'class-validator';

export class CreateResultDto {
  @IsUUID()
  modelId: string;

  @IsString()
  code: string;

  @IsString()
  description: string;

  @IsString()
  name: string;

  @IsString()
  score: string;
}
