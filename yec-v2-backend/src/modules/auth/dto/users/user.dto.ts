import { IsString, IsBoolean, IsOptional, IsNotEmpty, MinLength, IsEmail, MaxLength, IsDate } from 'class-validator';
import {
  isBooleanValidationOptions,
  isEmailValidationOptions,
  isNotEmptyValidationOptions,
  isStringValidationOptions,
  maxLengthValidationOptions,
  minLengthValidationOptions,
} from '@shared/validation';
import { CareerEntity, CatalogueEntity, InstitutionEntity } from '@core/entities';

export class UserDto {
  @IsOptional()
  readonly careers: any;

  @IsOptional()
  readonly bloodType: CatalogueEntity;

  @IsOptional()
  readonly ethnicOrigin: CatalogueEntity;

  @IsOptional()
  readonly identificationType: CatalogueEntity;

  @IsOptional()
  readonly gender: CatalogueEntity;

  @IsOptional()
  readonly institutions: InstitutionEntity[];

  @IsOptional()
  readonly institution: InstitutionEntity;

  @IsOptional()
  readonly maritalStatus: CatalogueEntity;

  @IsOptional()
  readonly sex: CatalogueEntity;

  @IsOptional()
  readonly avatar: string;

  @IsOptional()
  @IsDate(isNotEmptyValidationOptions())
  readonly birthdate: Date;

  @IsOptional()
  @MaxLength(10, maxLengthValidationOptions())
  readonly cellPhone: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly identification: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsEmail({}, isEmailValidationOptions())
  @MaxLength(150, maxLengthValidationOptions())
  readonly email: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsEmail({}, isEmailValidationOptions())
  @MaxLength(150, maxLengthValidationOptions())
  readonly emailVerifiedAt: Date;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly lastname: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString()
  @MinLength(8, minLengthValidationOptions())
  @MaxLength(32, minLengthValidationOptions())
  readonly password: string;

  @IsOptional()
  @IsBoolean(isBooleanValidationOptions())
  readonly passwordChanged: boolean;

  @IsOptional()
  @IsEmail({}, isEmailValidationOptions())
  @MaxLength(150, maxLengthValidationOptions())
  readonly personalEmail: string;

  @IsOptional()
  @MaxLength(20, minLengthValidationOptions())
  readonly phone: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString(isStringValidationOptions())
  readonly name: string;

  @IsNotEmpty(isNotEmptyValidationOptions())
  readonly roles: any;

  @IsNotEmpty(isNotEmptyValidationOptions())
  @IsString()
  @MinLength(5, minLengthValidationOptions())
  @MaxLength(100, maxLengthValidationOptions())
  readonly username: string;
}
