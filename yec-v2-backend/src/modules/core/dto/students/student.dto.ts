import { UserEntity } from '@auth/entities';
import { CareerEntity, InformationStudentEntity } from '@core/entities';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { isNotEmptyValidationOptions } from '@shared/validation';

export class StudentDto {
  @IsOptional()
  user: UserEntity;

  @IsOptional()
  careers: CareerEntity[];

  @IsOptional()
  informationStudent: InformationStudentEntity;
}
