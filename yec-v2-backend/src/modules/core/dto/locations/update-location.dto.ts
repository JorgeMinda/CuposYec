import { PartialType } from '@nestjs/swagger';
import { CreateLocationDto } from '@core/dto';

export class UpdateLocationDto extends PartialType(CreateLocationDto) {}
