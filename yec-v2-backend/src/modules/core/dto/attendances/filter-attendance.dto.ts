import { IsOptional, IsDate } from 'class-validator';
import { PaginationDto } from '@core/dto';
import { EnrollmentDetailEntity, PartialEntity } from '@core/entities';

export class FilterAttendanceDto extends PaginationDto {
  @IsOptional()
  @IsDate()
  readonly enrollmentDetail: EnrollmentDetailEntity;

  @IsOptional()
  @IsDate()
  readonly partial: PartialEntity;
}
