import { PartialType } from '@nestjs/swagger';
import { CreateStudentResultDto } from './create-student-result.dto';

export class UpdateStudentResultDto extends PartialType(CreateStudentResultDto) {}
