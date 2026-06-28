import { IsNotEmpty } from 'class-validator';
import { PaginationDto } from '@core/dto';
import { isNotEmptyValidationOptions } from '@shared/validation';

export class FilterFileDto extends PaginationDto {}
