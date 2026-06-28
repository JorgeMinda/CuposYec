import { Injectable } from '@nestjs/common';
import { RolesService } from '@auth/services';
import { CreateRoleDto } from '@auth/dto';
import { RoleEnum } from '@auth/enums';

@Injectable()
export class RolesSeeder {
  constructor(private rolesService: RolesService) {
  }

  async run() {
    await this.createRoles();
  }

  private async createRoles() {
    const roles: CreateRoleDto[] = [];
    roles.push(
      {
        code: RoleEnum.ADMIN,
        name: 'Administrador',
      },
      {
        code: RoleEnum.TEACHER,
        name: 'Docente',
      },
      {
        code: RoleEnum.STUDENT,
        name: 'Estudiante',
      },
      {
        code: RoleEnum.COORDINATOR_ADMINISTRATIVE,
        name: 'Coordinador Administrativo',
      },
      {
        code: RoleEnum.COORDINATOR_CAREER,
        name: 'Coordinador Carrera',
      },
      {
        code: RoleEnum.RECTOR,
        name: 'Rector',
      },
      {
        code: RoleEnum.REVIEWER,
        name: 'Revisor',
      },
      {
        code: RoleEnum.SECRETARY,
        name: 'Secretaria',
      },
      {
        code: RoleEnum.WELFARE,
        name: 'Bienestar Estudiantil',
      },
    );

    for (const role of roles) {
      await this.rolesService.create(role);
    }
  }
}
