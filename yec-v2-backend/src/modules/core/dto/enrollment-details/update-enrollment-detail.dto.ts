import { PartialType } from '@nestjs/mapped-types';
import { CreateEnrollmentsDetailDto } from '@core/dto';
import {IsDate, IsOptional} from "class-validator";

export class UpdateEnrollmentsDetailDto extends PartialType(CreateEnrollmentsDetailDto) {
    @IsOptional()
    @IsDate({message: 'El campo date debe ser una fecha'})
    readonly date: Date;
}
