import { PartialType } from '@nestjs/swagger';
import { CreateEventDto } from '@core/dto';

export class UpdateEventDto extends PartialType(CreateEventDto) {}
