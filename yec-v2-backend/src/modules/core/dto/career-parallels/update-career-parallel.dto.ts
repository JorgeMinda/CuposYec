import { PartialType } from '@nestjs/swagger';
import { CreateCareerParallelDto } from '@core/dto';

export class UpdateCareerParallelDto extends PartialType(CreateCareerParallelDto) {}