import { Injectable } from '@nestjs/common';
import { MenusService, RolesService } from '@auth/services';
import { CreateMenuDto } from '@auth/dto';
import { MenuTypeEnum, RoleEnum } from '@auth/enums';
import { MenuEntity } from '@auth/entities';
import { PrimeIcons } from '../../shared/enums/prime-icons.enum';

@Injectable()
export class MenusSeeder {
  constructor(private menusService: MenusService, private rolesService: RolesService) {
  }

  async run() {
    await this.createMenus();
    await this.createMenuRole();
  }

  private async createMenus() {
    let menus: CreateMenuDto[] = [];
    menus.push(
      {
        code: RoleEnum.ADMIN,
        icon: PrimeIcons.USER,
        isVisible: true,
        label: 'Administrador',
        order: 1,
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: RoleEnum.TEACHER,
        icon: PrimeIcons.LIST,
        isVisible: true,
        label: 'Docentes',
        order: 1,
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: RoleEnum.STUDENT,
        icon: PrimeIcons.LIST,
        isVisible: true,
        label: 'Estudiantes',
        order: 1,
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: RoleEnum.COORDINATOR_ADMINISTRATIVE,
        icon: PrimeIcons.LIST,
        isVisible: true,
        label: 'Coordinador Administrativo',
        order: 1,
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: RoleEnum.COORDINATOR_CAREER,
        icon: PrimeIcons.LIST,
        isVisible: true,
        label: 'Coordinador de Carrera',
        order: 1,
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: RoleEnum.RECTOR,
        icon: PrimeIcons.LIST,
        isVisible: true,
        label: 'Rectorado',
        order: 1,
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: RoleEnum.REVIEWER,
        icon: PrimeIcons.LIST,
        isVisible: true,
        label: 'Revisor',
        order: 1,
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: RoleEnum.SECRETARY,
        icon: PrimeIcons.LIST,
        isVisible: true,
        label: 'Secretaría',
        order: 1,
        type: MenuTypeEnum.LEFT_SIDE,
      },
      {
        code: RoleEnum.WELFARE,
        icon: PrimeIcons.LIST,
        isVisible: true,
        label: 'Bienestar Estudiantil',
        order: 1,
        type: MenuTypeEnum.LEFT_SIDE,
      },
    );

    for (const menu of menus) {
      await this.menusService.create(menu);
    }

    const menusAll = (await this.menusService.findAll()).data as MenuEntity[];

    /** Admin Role **/
    const adminMenu = menusAll.find(menu => menu.code === RoleEnum.ADMIN);

    menus = [];
    menus.push(
      {
        code: 'users',
        icon: 'pi pi-users',
        isVisible: true,
        label: 'Usuarios',
        order: 1,
        routerLink: '/admin/users',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: adminMenu,
      },
      {
        code: 'menus',
        icon: 'pi pi-users',
        isVisible: true,
        label: 'Menus',
        order: 2,
        routerLink: '/admin/menus',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: adminMenu,
      },
    );

    for (const menu of menus) {
      await this.menusService.create(menu);
    }

    /** Coordinator Career Role **/
    const coordinatorCareer = menusAll.find(menu => menu.code === RoleEnum.COORDINATOR_CAREER);

    menus = [];
    menus.push(
      {
        code: 'institutions',
        icon: 'pi pi-bars',
        isVisible: true,
        label: 'Instituciones',
        order: 1,
        routerLink: '/core/coordinator-career/institutions',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: coordinatorCareer,
      },
      {
        code: 'careers',
        icon: 'pi pi-bars',
        isVisible: true,
        label: 'Carreras',
        order: 2,
        routerLink: '/core/coordinator-career/careers',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: coordinatorCareer,
      },
      {
        code: 'curriculums',
        icon: 'pi pi-list',
        isVisible: true,
        label: 'Mallas Curriculares',
        order: 3,
        routerLink: '/core/coordinator-career/curriculums',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: coordinatorCareer,
      },
      {
        code: 'subjects',
        icon: 'pi pi-book',
        isVisible: true,
        label: 'Asignaturas',
        order: 4,
        routerLink: '/core/coordinator-career/subjects',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: coordinatorCareer,
      },
      {
        code: 'teachers',
        icon: 'pi pi-bars',
        isVisible: true,
        label: 'Admin Docentes',
        order: 5,
        routerLink: '/core/coordinator-career/teachers',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: coordinatorCareer,
      },
      {
        code: 'school-periods',
        icon: 'pi pi-bars',
        isVisible: true,
        label: 'Periodos Lectivos',
        order: 6,
        routerLink: '/core/coordinator-career/school-periods',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: coordinatorCareer,
      },
      {
        code: 'consolidated-grades',
        icon: 'pi pi-bars',
        isVisible: false,
        label: 'Consolidado de notas',
        order: 7,
        routerLink: '/core/coordinator-career/consolidated-notes',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: coordinatorCareer,
      },
      {
        code: 'teacher-distributions',
        icon: 'pi pi-bars',
        isVisible: true,
        label: 'Distributivo Docente',
        order: 8,
        routerLink: '/core/coordinator-career/teacher-distributions',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: coordinatorCareer,
      },
    );

    /** Reviewer Role **/
    const reviewerMenu = menusAll.find(menu => menu.code === RoleEnum.REVIEWER);
    menus.push(
      {
        code: 'inscription-list',
        icon: 'pi pi-users',
        isVisible: true,
        label: 'Administración de Inscripciones',
        order: 1,
        routerLink: '/core/reviewer/inscriptions',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: reviewerMenu,
      },
    );

    const secretaryMenu = menusAll.find(menu => menu.code === RoleEnum.SECRETARY);

    menus.push(
      {
        code: 'enrollment-list',
        icon: 'pi pi-users',
        isVisible: true,
        label: 'Administración de Matrículas',
        order: 1,
        routerLink: '/core/secretary/enrollments',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: secretaryMenu,
      },
    );

    /** Student Role **/
    const studentMenu = menusAll.find(menu => menu.code === RoleEnum.STUDENT);

    menus.push(
      {
        code: 'enrollment-application',
        icon: 'pi pi-users',
        isVisible: true,
        label: 'Solicitud de Matrícula',
        order: 1,
        routerLink: '/core/student/enrollment-application',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: studentMenu,
      },
      {
        code: 'enrollment-subjects',
        icon: 'pi pi-users',
        isVisible: true,
        label: 'Asignaturas',
        order: 2,
        routerLink: '/core/student/enrollment-subjects',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: studentMenu,
      },
    );

    /** Teacher Role **/
    const teacherMenu = menusAll.find(menu => menu.code === RoleEnum.TEACHER);

    menus.push(
      {
        code: 'teacher-subjects',
        icon: 'pi pi-book',
        isVisible: true,
        label: 'Mis Asignaturas',
        order: 1,
        routerLink: '/core/teacher/teacher-subjects',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: teacherMenu,
      },
    );

    /** Welfare Role **/
    const welfareMenu = menusAll.find(menu => menu.code === RoleEnum.WELFARE);

    menus.push(
      {
        code: 'enrollments',
        icon: 'pi pi-verified',
        isVisible: true,
        label: 'Matriculados',
        order: 1,
        routerLink: '/core/welfare/enrollments',
        type: MenuTypeEnum.LEFT_SIDE,
        parent: welfareMenu,
      },
    );

    for (const menu of menus) {
      await this.menusService.create(menu);
    }
  }

  private async createMenuRole() {
    const menusAll = (await this.menusService.findAll()).data;

    let role = await this.rolesService.findByCode(RoleEnum.ADMIN);
    role.menus = menusAll.filter(menu => menu.code === RoleEnum.ADMIN);
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.STUDENT);
    role.menus = menusAll.filter(menu => menu.code === RoleEnum.STUDENT);
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.TEACHER);
    role.menus = menusAll.filter(menu => menu.code === RoleEnum.TEACHER);
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.COORDINATOR_CAREER);
    role.menus = menusAll.filter(menu => menu.code === RoleEnum.COORDINATOR_CAREER);
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.REVIEWER);
    role.menus = menusAll.filter(menu => menu.code === RoleEnum.REVIEWER);
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.SECRETARY);
    role.menus = menusAll.filter(menu => menu.code === RoleEnum.SECRETARY);
    await this.rolesService.createMenus(role);

    role = await this.rolesService.findByCode(RoleEnum.WELFARE);
    role.menus = menusAll.filter(menu => menu.code === RoleEnum.WELFARE);
    await this.rolesService.createMenus(role);
  }
}
