import { IsNotEmpty, IsString } from 'class-validator';

export class PasswordChangeDto {
  @IsNotEmpty()
  @IsString()
  passwordConfirmation: string;

  @IsNotEmpty()
  @IsString()
  passwordNew: string;

  @IsNotEmpty()
  @IsString()
  passwordOld: string;
}
