import { PartialType } from '@nestjs/swagger';
import { CreateTeacherDistributionDto } from '@core/dto';

export class UpdateTeacherDistributionDto extends PartialType(CreateTeacherDistributionDto) {}
