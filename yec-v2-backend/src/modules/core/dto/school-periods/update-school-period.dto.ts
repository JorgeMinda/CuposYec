import { PartialType } from '@nestjs/swagger';
import { CreateSchoolPeriodDto } from '@core/dto';

export class UpdateSchoolPeriodDto extends PartialType(CreateSchoolPeriodDto) {}
