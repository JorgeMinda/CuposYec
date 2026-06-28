import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from '@core/dto';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
