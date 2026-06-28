import { IsNotEmpty } from 'class-validator';
import { EnrollmentDetailEntity, PartialEntity } from '@core/entities';
import { isNotEmptyValidationOptions } from '@shared/validation';

export class GradeDto {
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly enrollmentDetail: EnrollmentDetailEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly partial: PartialEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly value: number;
}
