import { IsString, MinLength, IsDate, IsPositive, IsOptional, IsNotEmpty } from 'class-validator';
import { CareerEntity, CatalogueEntity } from '@core/entities';
import { isNotEmptyValidationOptions, isStringValidationOptions, minLengthValidationOptions } from '@shared/validation';

export class CurriculumDto {
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly career: CareerEntity;

  @IsOptional()
  readonly state: CatalogueEntity;

  @IsString(isStringValidationOptions())
  @MinLength(3, minLengthValidationOptions())
  readonly code: string;

  @IsString(isStringValidationOptions())
  readonly description: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly isVisible: boolean;

  @IsString(isStringValidationOptions())
  readonly name: string;

  @IsPositive({ message: ' el campo periodicAcademicNumber es positivo' })
  readonly periodicAcademicNumber: number;

  @IsString(isStringValidationOptions())
  readonly resolutionNumber: string;

  @IsPositive({ message: ' el campo weeksNumber debe ser positivo' })
  readonly weeksNumber: number;
}
