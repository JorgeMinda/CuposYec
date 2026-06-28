import { PickType } from '@nestjs/swagger';
import { TeacherDto } from './teacher.dto';

export class SeedTeacherDto extends PickType(TeacherDto, ['user', 'careers']) {}
