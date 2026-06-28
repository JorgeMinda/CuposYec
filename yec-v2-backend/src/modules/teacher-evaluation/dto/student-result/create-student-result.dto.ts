import { IsUUID, IsNumber, IsNotEmpty } from 'class-validator';

export class CreateStudentResultDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  teacherDistributionId: string;

  @IsNumber()
  @IsNotEmpty()
  totalScore: number;
}
