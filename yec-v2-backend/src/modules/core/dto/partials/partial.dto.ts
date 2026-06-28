import { IsString } from 'class-validator';
import { isStringValidationOptions } from '@shared/validation';

export class PartialDto {
  @IsString(isStringValidationOptions())
  readonly code: string;

  @IsString(isStringValidationOptions())
  readonly name: string;
}
