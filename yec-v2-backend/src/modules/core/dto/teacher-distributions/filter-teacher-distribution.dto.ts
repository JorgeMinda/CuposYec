import { IsString, IsNumber, IsOptional, IsNotEmpty } from 'class-validator';
import { PaginationDto } from '@core/dto';

export class FilterTeacherDistributionDto extends PaginationDto {
  @IsString({ message: 'El campo parallel debe ser un string' })
  @IsNotEmpty({ message: 'El campo parallel_id es obligatorio' })
  readonly parallel_id: string;

  @IsString({ message: 'El campo teacher debe ser un string' })
  @IsNotEmpty({ message: 'El campo teacher_id es obligatorio' })
  readonly teacher_id: string;

  @IsString({ message: 'El campo school_period debe ser un string' })
  @IsNotEmpty({ message: 'El campo school_period_id es obligatorio' })
  readonly school_period_id: string;

  @IsString({ message: 'El campo subject debe ser un string' })
  @IsNotEmpty({ message: 'El campo subject_id es obligatorio' })
  readonly subject_id: string;

  @IsString({ message: 'El campo workday debe ser un string' })
  @IsNotEmpty({ message: 'El campo workday_id es obligatorio' })
  readonly workday_id: string;

  @IsNumber({}, { message: 'El campo hours debe ser un número' })
  readonly hours: number;
}
