import { IsString, IsNumber, IsOptional } from 'class-validator';
import { PaginationDto } from '@core/dto';
import { isNumberValidationOptions, isStringValidationOptions } from '@shared/validation';

export class FilterInformationStudentDto extends PaginationDto {
  @IsOptional()
  @IsNumber({}, isNumberValidationOptions())
  readonly community: number;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly contactEmergencyName: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly contactEmergencyKinship: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly contactEmergencyPhone: string;

  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly postalCode: string;
}
