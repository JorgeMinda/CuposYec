import { IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '@core/dto';
import { isStringValidationOptions } from '@shared/validation';

export class FilterTeacherDto extends PaginationDto {
  @IsOptional()
  @IsString(isStringValidationOptions())
  readonly name: string;
}
