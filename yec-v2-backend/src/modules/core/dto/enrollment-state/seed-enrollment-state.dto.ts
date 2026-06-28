import {EnrollmentStateDto} from '@core/dto';
import {PickType} from "@nestjs/swagger";

export class SeedEnrollmentStateDto extends PickType(EnrollmentStateDto, [
    'enrollmentId',
    'stateId',
    'userId',
]) {
}
