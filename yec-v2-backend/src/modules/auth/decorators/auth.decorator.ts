import { applyDecorators, UseGuards } from '@nestjs/common';
import { JwtGuard, RolesGuard } from '@auth/guards';
import { ApiBearerAuth } from '@nestjs/swagger';
import { RoleEnum } from '@auth/enums';

export function Auth(...roles: RoleEnum[]) {
  return applyDecorators(UseGuards(JwtGuard, RolesGuard), ApiBearerAuth());
}
