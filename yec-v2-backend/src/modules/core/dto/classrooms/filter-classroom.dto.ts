import { IsNumber } from 'class-validator';
import { PaginationDto } from '@core/dto';

export class FilterClassroomDto extends PaginationDto {
  @IsNumber()
  readonly name: string;
}
