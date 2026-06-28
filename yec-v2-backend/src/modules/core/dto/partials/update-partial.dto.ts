import { PartialType } from '@nestjs/swagger';
import { CreatePartialDto } from '@core/dto';

export class UpdatePartialDto extends PartialType(CreatePartialDto) {}
