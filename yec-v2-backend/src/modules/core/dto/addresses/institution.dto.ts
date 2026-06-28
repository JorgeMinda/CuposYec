import { IsEmail, IsNotEmpty, IsOptional, IsPositive, IsString, IsUrl, MaxLength, MinLength } from 'class-validator';
import { CatalogueEntity } from '@core/entities';
import {
  isEmailValidationOptions,
  isNotEmptyValidationOptions,
  isStringValidationOptions,
  isUrlValidationOptions,
  minLengthValidationOptions,
} from '@shared/validation';

export class InstitutionDto {
  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly state: CatalogueEntity;

  @IsString(isStringValidationOptions())
  @MinLength(3, minLengthValidationOptions())
  readonly acronym: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly cellphone: string;

  @IsString(isStringValidationOptions())
  @MinLength(3, minLengthValidationOptions())
  readonly code: string;

  @IsString(isStringValidationOptions())
  readonly codeSniese: string;

  @IsString(isStringValidationOptions())
  readonly denomination: string;

  @IsOptional()
  @IsEmail({}, isEmailValidationOptions())
  readonly email: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly isVisible: boolean;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly logo: string;

  @IsString(isStringValidationOptions())
  readonly name: string;

  @IsOptional({ message: 'phone es opcional' })
  @IsString(isStringValidationOptions())
  readonly phone: string;

  @IsString(isStringValidationOptions())
  readonly shortName: string;

  @IsOptional({ message: 'slogan es opcional' })
  @IsString(isStringValidationOptions())
  readonly slogan: string;

  @IsOptional({ message: 'web es opcional' })
  @IsUrl({}, isUrlValidationOptions())
  readonly web: string;
}
