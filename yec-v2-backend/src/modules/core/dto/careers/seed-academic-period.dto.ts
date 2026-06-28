import {IsOptional} from "class-validator";
import {isNotEmptyValidationOptions} from "@shared/validation";
import {CareerAcademicPeriodsEntity} from "@core/entities";

export class SeedAcademicPeriodDto {
    @IsOptional(isNotEmptyValidationOptions())
    readonly catalogues: CareerAcademicPeriodsEntity[];
}
