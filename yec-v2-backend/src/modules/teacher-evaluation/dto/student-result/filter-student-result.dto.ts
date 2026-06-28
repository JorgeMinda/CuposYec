import { IsOptional, IsUUID, IsNumber } from 'class-validator';
import { PaginationDto } from '@core/dto';

export class FilterStudentResultDto extends PaginationDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsOptional()
  @IsUUID()
  teacherDistributionId?: string;

  @IsOptional()
  @IsNumber()
  totalScore?: number;
}
