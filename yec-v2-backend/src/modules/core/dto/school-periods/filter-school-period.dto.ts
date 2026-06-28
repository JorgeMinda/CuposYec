import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from '@core/dto';

export class FilterSchoolPeriodDto extends PaginationDto {
  @IsString({ message: 'El campo codeSniese debe ser un string' })
  @IsOptional()
  readonly codeSniese: string;

  @IsString({ message: 'El campo name debe ser un string' })
  @IsOptional()
  readonly name: string;

  @IsString({ message: 'El campo shortName debe ser un string' })
  @IsOptional()
  readonly shortName: string;
}
