import {IsNotEmpty, IsOptional, IsString, IsDate, Min, MinLength} from 'class-validator';
import {StudentEntity, CatalogueEntity, SchoolPeriodEntity, CareerEntity, EnrollmentDetailEntity} from '@core/entities';
import {CreateEnrollmentsDetailDto} from "../enrollment-details/create-enrollment-detail.dto";
import {isStringValidationOptions, minLengthValidationOptions} from "@shared/validation";

export class SendRegistrationDto {
    @IsNotEmpty()
    readonly student: StudentEntity;

    @IsNotEmpty()
    readonly academicPeriod: CatalogueEntity;

    @IsNotEmpty()
    readonly career: CareerEntity;

    @IsNotEmpty()
    readonly enrollmentDetails: EnrollmentDetailEntity[];
    // readonly enrollmentDetails: any[];

    @IsNotEmpty()
    readonly parallel: CatalogueEntity;

    @IsNotEmpty()
    readonly schoolPeriod: SchoolPeriodEntity;

    @IsNotEmpty()
    readonly workday: CatalogueEntity;

    @IsOptional()
    @IsString(isStringValidationOptions())
    @Min(5, minLengthValidationOptions())
    readonly observation: string;
}
