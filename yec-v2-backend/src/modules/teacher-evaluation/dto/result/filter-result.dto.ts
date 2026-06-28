import { IsOptional, IsUUID, IsString } from 'class-validator';

export class FilterResultDto {
  @IsOptional()
  @IsUUID()
  modelId?: string;

  @IsOptional()
  @IsString()
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  score?: string;

  @IsOptional()
  limit?: number;

  @IsOptional()
  offset?: number;
}
