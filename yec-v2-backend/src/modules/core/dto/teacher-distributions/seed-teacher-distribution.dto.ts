import {TeacherDistributionDto} from '@core/dto';
import {PickType} from "@nestjs/swagger";

export class SeedTeacherDistributionDto extends PickType(TeacherDistributionDto, [
    'capacity',
    'parallel',
    'schoolPeriod',
    'subject',
    'workday',
]) {
}
