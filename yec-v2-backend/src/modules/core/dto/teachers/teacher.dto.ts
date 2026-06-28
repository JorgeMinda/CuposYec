import { UserEntity } from '@auth/entities';
import { CareerEntity, InformationTeacherEntity } from '@core/entities';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { isNotEmptyValidationOptions, isStringValidationOptions } from '@shared/validation';

export class TeacherDto {
  @IsOptional()
  careers: CareerEntity[];

  @IsNotEmpty(isNotEmptyValidationOptions())
  user: UserEntity;

  @IsOptional()
  informationTeacher: InformationTeacherEntity;

  @IsString(isStringValidationOptions())
  userId: string;
}
