import { CatalogueEntity, SchoolPeriodEntity, SubjectEntity, TeacherEntity } from '@core/entities';
import { IsOptional } from 'class-validator';
import { isNotEmptyValidationOptions } from '@shared/validation';

export class TeacherDistributionDto {
  @IsOptional()
  readonly capacity: number;

  @IsOptional()
  readonly parallel: CatalogueEntity;

  @IsOptional()
  readonly teacher: TeacherEntity;

  @IsOptional()
  readonly schoolPeriod: SchoolPeriodEntity;

  @IsOptional()
  readonly subject: SubjectEntity;

  @IsOptional()
  readonly workday: CatalogueEntity;

  @IsOptional()
  readonly hours: number;
}
