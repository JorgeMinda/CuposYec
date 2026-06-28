import { PickType } from '@nestjs/swagger';
import { InformationStudentDto } from './information-student.dto';

export class SeederInformationStudentDto extends PickType(InformationStudentDto, ['student']) {}
