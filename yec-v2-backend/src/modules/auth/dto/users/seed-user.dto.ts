import { PickType } from '@nestjs/swagger';
import { UserDto } from '@auth/dto';

export class SeedUserDto extends PickType(UserDto, [
  'birthdate',
  'careers',
  'identificationType',
  'cellPhone',
  'identification',
  'institutions',
  'email',
  'lastname',
  'name',
  'password',
  'passwordChanged',
  'personalEmail',
  'roles',
  'username',
]) {}
