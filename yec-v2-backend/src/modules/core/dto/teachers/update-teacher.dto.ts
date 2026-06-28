import { PartialType } from '@nestjs/swagger';
import { CreateTeacherDto } from '@core/dto';

export class UpdateTeacherDto extends PartialType(CreateTeacherDto) {}
