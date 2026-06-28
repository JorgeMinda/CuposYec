import {IsDate, IsNotEmpty, IsOptional} from "class-validator";

export class EnrollmentStateDto {
    @IsNotEmpty()
    readonly enrollmentId: string;

    @IsNotEmpty()
    readonly stateId: string;

    @IsNotEmpty()
    readonly userId: string;

    @IsOptional()
    @IsDate({message: 'El campo date debe ser una fecha'})
    readonly date: Date;

    @IsOptional()
    readonly observation: string;
}