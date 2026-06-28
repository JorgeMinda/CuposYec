import { CatalogueEntity, StudentEntity } from '@core/entities';
import { IsString, IsNotEmpty, IsNumber, MaxLength, Min, Max, IsOptional } from 'class-validator';
import { isNumberValidationOptions, isStringValidationOptions, isNotEmptyValidationOptions } from '@shared/validation';

export class InformationStudentDto {
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly student: StudentEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly isHasChildren: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly isDisability: CatalogueEntity;

  @IsOptional()
  readonly isExecutedPractice: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly isExecutedCommunity: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly isHouseHead: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly isLostGratuity: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly isSubjectLost: CatalogueEntity;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly familyIncome: CatalogueEntity;

  @IsOptional()
  readonly contactEmergencyKinship: CatalogueEntity;

  @IsString(isStringValidationOptions())
  @MaxLength(1000, { message: 'Maximo 1000 caracteres' })
  readonly address: string;

  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El número de digitos mínimo es 0.' })
  readonly community: number;

  @IsString(isStringValidationOptions())
  @MaxLength(255, { message: 'Maximo 255 caracteres' })
  readonly contactEmergencyName: string;

  @IsString(isStringValidationOptions())
  @MaxLength(255, { message: 'Maximo 255 caracteres' })
  readonly contactEmergencyPhone: string;

  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El número de digito mínimo es 0.' })
  @Max(100, { message: 'Maximo 100 digito' })
  readonly disabilityPercentage: number;

  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El número de digito mínimo es 0.' })
  readonly educationalAmount: number;

  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El número de digito mínimo es 0.' })
  readonly economicAmount: number;

  @IsNumber({}, isNumberValidationOptions())
  @Min(1, { message: 'El número de digitos mínimo es 1.' })
  @Max(20, { message: 'Maximo 20 digitos' })
  readonly membersHouseNumber: number;

  @IsString(isStringValidationOptions())
  @MaxLength(100, { message: 'Maximo 100 caracteres' })
  readonly postalCode: string;

  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El número de digito mínimo es 0.' })
  readonly practiceHours: number;

  @IsNumber({}, isNumberValidationOptions())
  readonly scholarshipAmount: number;

  @IsNumber({}, isNumberValidationOptions())
  @Min(0, { message: 'El número de digito mínimo es 0.' })
  @Max(100, { message: 'Maximo 100 digito' })
  readonly tariffScholarshipPercentage: number;
}
