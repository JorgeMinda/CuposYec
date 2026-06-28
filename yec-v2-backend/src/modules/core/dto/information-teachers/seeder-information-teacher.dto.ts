import { PickType } from '@nestjs/swagger';
import { InformationTeacherDto } from './information-teacher.dto';

export class SeederInformationTeacherDto extends PickType(InformationTeacherDto, ['teacher']) {}
