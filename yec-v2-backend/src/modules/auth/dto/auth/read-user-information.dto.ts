import { Exclude, Expose } from 'class-transformer';
import { UserDto } from '@auth/dto';
import { TeacherDto } from '../../../core/dto/teachers/teacher.dto';

@Exclude()
export class ReadUserInformationDto extends UserDto {
  @Expose()
  readonly id;

  @Expose()
  readonly email;

  @Expose()
  readonly emailVerifiedAt;

  @Expose()
  readonly phone;

  @Expose()
  readonly username;

  @Expose()
  readonly teacher;
}
