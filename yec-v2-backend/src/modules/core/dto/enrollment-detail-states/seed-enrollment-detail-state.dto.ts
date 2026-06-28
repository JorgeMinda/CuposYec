import {EnrollmentStateDto} from '@core/dto';
import {PickType} from "@nestjs/swagger";

export class SeedEnrollmentDetailStateDto extends PickType(EnrollmentStateDto, [
    'enrollmentId',
    'stateId',
    'userId',
]) {
}
