import { CareerEntity, CatalogueEntity, ClassroomEntity } from '@core/entities';
import { IsOptional, IsInt, Min, IsUUID, IsNotEmpty } from 'class-validator';
import {
  isNotEmptyValidationOptions,
} from '@shared/validation';

export class CareerParallelDto {
  @IsOptional(isNotEmptyValidationOptions())
  readonly academicPeriod: CatalogueEntity;

  @IsOptional()
  @IsUUID()
  readonly academicPeriodId: string;

  @IsOptional(isNotEmptyValidationOptions())
  readonly career: CareerEntity;

  @IsNotEmpty()
  @IsUUID()
  readonly careerId: string;

  @IsOptional(isNotEmptyValidationOptions())
  readonly workday: CatalogueEntity;

  @IsNotEmpty()
  @IsUUID()
  readonly workdayId: string;

  @IsOptional(isNotEmptyValidationOptions())
  readonly parallel: CatalogueEntity;

  @IsNotEmpty()
  @IsUUID()
  readonly parallelId: string;

  @IsOptional(isNotEmptyValidationOptions())
  readonly classroom: ClassroomEntity;

  @IsOptional()
  @IsUUID()
  readonly classroomId: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  readonly capacity: number;
}