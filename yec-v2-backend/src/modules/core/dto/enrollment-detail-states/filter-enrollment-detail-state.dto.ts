import { IsNumber, IsOptional, IsString, IsDate } from 'class-validator';
import { PaginationDto } from '@core/dto';

export class FilterEnrollmentDetailStateDto extends PaginationDto {
  @IsOptional()
  @IsNumber()
  readonly number: number;

  @IsOptional()
  @IsDate()
  readonly date: Date;
}
