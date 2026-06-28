import {PartialType} from '@nestjs/swagger';
import {SchoolPeriodDto} from '@core/dto';

export class SeedSchoolPeriodDto extends PartialType(SchoolPeriodDto) {
}
