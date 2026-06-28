import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '@auth/constants';
import { RoleEnum } from '@auth/enums';
import { UserEntity } from '@auth/entities';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles: RoleEnum[] = this.reflector.get(ROLES_KEY, context.getHandler());

    if (!roles || roles.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const user = request.user as UserEntity;

    const isAuth = roles.some(role => {
      return user.roles.some(roleUser => roleUser.code === role);
    });

    if (!isAuth) {
      throw new ForbiddenException();
    }

    return true;
  }
}
