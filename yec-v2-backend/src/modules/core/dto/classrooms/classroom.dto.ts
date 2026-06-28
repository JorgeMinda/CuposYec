import { IsNotEmpty } from 'class-validator';
import { isNotEmptyValidationOptions } from '@shared/validation';
import { CatalogueEntity } from '@core/entities';

export class ClassroomDto {
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly state: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly type: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly capacity: number;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly code: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly location: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly name: string;
}
