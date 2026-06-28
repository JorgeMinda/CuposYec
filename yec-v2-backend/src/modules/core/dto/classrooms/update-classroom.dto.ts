import { PartialType } from '@nestjs/swagger';
import { CreateClassroomDto } from '@core/dto';

export class UpdateClassroomDto extends PartialType(CreateClassroomDto) {}
