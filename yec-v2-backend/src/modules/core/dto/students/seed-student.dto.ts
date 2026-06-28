import { PickType } from '@nestjs/swagger';
import { StudentDto } from './student.dto';

export class SeedStudentDto extends PickType(StudentDto, ['user', 'careers']) {}
