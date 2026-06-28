import { PartialType } from '@nestjs/mapped-types';
import { CreateGradeDto } from '@core/dto';

export class UpdateGradeDto extends PartialType(CreateGradeDto) {}
