import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CareerEntity,
  CatalogueEntity,
  EnrollmentDetailEntity,
  EnrollmentEntity,
  InstitutionEntity,
  PartialPermissionEntity,
  StudentEntity,
  TeacherDistributionEntity, TeacherEntity,
} from '@core/entities';
import { AuthRepositoryEnum, CatalogueTypeEnum, CoreRepositoryEnum } from '@shared/enums';
import { join } from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { RoleEnum } from '@auth/enums';
import { RoleEntity, UserEntity } from '@auth/entities';
import { RolesService } from '@auth/services';
import { CareersService, CataloguesService, InstitutionsService } from '@core/services';
import * as Bcrypt from 'bcrypt';

enum ColumnsEnum {
  CAREER_CODE = 'Codigo_Carrera',
  IDENTIFICATION = 'Numero_Documento',
  LAST_NAME = 'Apellidos',
  NAME = 'Nombres',
  EMAIL = 'Correo_Institucional',
}

interface ErrorModel {
  row: number;
  column: string;
  observation: string;
}

@Injectable()
export class TeachersService {
  private errors: ErrorModel[] = [];
  private attendanceErrors: ErrorModel[] = [];
  private row = 1;
  private identificationTypes: CatalogueEntity[] = [];
  private roles: RoleEntity[] = [];
  private institutions: InstitutionEntity[] = [];
  private careers: CareerEntity[] = [];

  constructor(
    private readonly careersService: CareersService,
    private readonly rolesService: RolesService,
    private readonly cataloguesService: CataloguesService,
    private readonly institutionsService: InstitutionsService,
    @Inject(CoreRepositoryEnum.CATALOGUE_REPOSITORY) private readonly catalogueRepository: Repository<CatalogueEntity>,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private readonly userRepository: Repository<UserEntity>,
    @Inject(CoreRepositoryEnum.TEACHER_REPOSITORY) private readonly teacherRepository: Repository<TeacherEntity>,
    @Inject(CoreRepositoryEnum.STUDENT_REPOSITORY) private readonly studentRepository: Repository<StudentEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_REPOSITORY) private readonly enrollmentRepository: Repository<EnrollmentEntity>,
    @Inject(CoreRepositoryEnum.ENROLLMENT_DETAIL_REPOSITORY) private readonly enrollmentDetailRepository: Repository<EnrollmentDetailEntity>,
    @Inject(CoreRepositoryEnum.TEACHER_DISTRIBUTION_REPOSITORY) private readonly teacherDistributionRepository: Repository<TeacherDistributionEntity>,
    @Inject(CoreRepositoryEnum.PARTIAL_PERMISSION_REPOSITORY) private readonly partialPermissionRepository: Repository<PartialPermissionEntity>,
  ) {
  }

  async loadCareers() {
    this.careers = (await this.careersService.findCareersByInstitution(this.institutions[0].id)).data;
  }

  async loadRoles() {
    this.roles = (await this.rolesService.findAll()).data as RoleEntity[];
  }

  async loadInstitutions() {
    this.institutions = (await this.institutionsService.findAll()).data;
  }

  async loadCatalogues() {
    const catalogues = (await this.cataloguesService.findAll()).data as CatalogueEntity[];

    this.identificationTypes = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.IDENTIFICATION_TYPE);

  }

  async importTeachers(file: Express.Multer.File, payload: any) {
    try {
      await this.loadInstitutions();
      await this.loadCareers();
      await this.loadRoles();
      await this.loadCatalogues();

      const teacherRole = this.roles.find(role => role.code === RoleEnum.TEACHER);
      const institution = this.institutions[0];

      const path = join(process.cwd(), 'storage/imports', file.filename);

      const workbook = XLSX.readFile(path);
      const workbookSheets = workbook.SheetNames;
      const sheet = workbookSheets[0];
      const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

      this.row = 1;

      for (const item of dataExcel) {
        this.row++;

        const career = this.careers.find(career => career.code === item[ColumnsEnum.CAREER_CODE]);

        let user: any = await this.userRepository.findOne({
          relations: { careers: true, roles: true },
          where: { identification: item[ColumnsEnum.IDENTIFICATION] },
        });

        if (!user) {
          user =
            {
              identificationType: this.identificationTypes[0],
              identification: item[ColumnsEnum.IDENTIFICATION],
              institutions: [institution],
              email: item[ColumnsEnum.EMAIL],
              lastname: item[ColumnsEnum.LAST_NAME],
              name: item[ColumnsEnum.NAME],
              password: item[ColumnsEnum.IDENTIFICATION],
              passwordChanged: false,
              personalEmail: item[ColumnsEnum.EMAIL],
              username: item[ColumnsEnum.IDENTIFICATION],
              careers: [career],
              roles: [teacherRole],
            };
        } else {
          user.careers = user.careers.concat(career);
          user.roles = user.roles.concat(teacherRole);
        }

        const userCreated = await this.userRepository.save(user);

        let teacher: any = await this.teacherRepository.findOne({ where: { userId: userCreated.id } });

        if (!teacher) {
          teacher = this.teacherRepository.create();
          teacher.userId = userCreated.id;

          await this.teacherRepository.save(teacher);
        }
      }

      fs.unlinkSync(join(process.cwd(), 'storage/imports', file.filename));

      if (this.errors.length > 0)
        throw new BadRequestException();

    } catch (err) {
      throw new BadRequestException('Problemas al subir el archivo, por favor verifique los errores');
    }
  }

  async generateErrorReport(teacherDistributionId: string) {
    const errors = this.errors.concat(this.attendanceErrors);

    const data = errors.map(error => {
      return {
        'Fila': error.row,
        'Columna': error.column,
        'Observación': error.observation,
      };
    });

    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Errores');
    const path = join(process.cwd(), 'storage/reports/grades', teacherDistributionId + '.xlsx'); //review path
    XLSX.writeFile(newWorkbook, path);

    return path;
  }
}
