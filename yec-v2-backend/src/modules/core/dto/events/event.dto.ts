import { CatalogueEntity, SchoolPeriodEntity } from '@core/entities';
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';
import { isNotEmptyValidationOptions, isStringValidationOptions } from '@shared/validation';

export class EventDto {
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly isVisible: boolean;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly name: CatalogueEntity;

  @IsOptional()
  readonly schoolPeriod: SchoolPeriodEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly state: CatalogueEntity;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly description: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly endedAt: Date;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly order: number;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly startedAt: Date;
}
