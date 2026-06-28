import { BadRequestException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CareerEntity,
  CatalogueEntity,
  EnrollmentDetailEntity,
  EnrollmentEntity,
  GradeEntity, InstitutionEntity,
  PartialEntity, PartialPermissionEntity,
  StudentEntity, SubjectEntity,
  TeacherDistributionEntity, TeacherEntity,
} from '@core/entities';
import { AuthRepositoryEnum, CatalogueTypeEnum, CoreRepositoryEnum } from '@shared/enums';
import { join } from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { RoleEnum } from '@auth/enums';
import { RoleEntity, UserEntity } from '@auth/entities';
import { RolesService } from '@auth/services';
import { CareersService, CataloguesService, InformationStudentsService, InstitutionsService } from '@core/services';
import * as Bcrypt from 'bcrypt';

enum ColumnsEnum {
  IDENTIFICATION = 'Numero_Documento',
}

interface ErrorModel {
  row: number;
  column: string;
  observation: string;
}

@Injectable()
export class StudentsService {
  private errors: ErrorModel[] = [];
  private row = 1;
  private identificationTypes: CatalogueEntity[] = [];
  private yesNo: CatalogueEntity[] = [];
  private roles: RoleEntity[] = [];
  private institutions: InstitutionEntity[] = [];
  private careers: CareerEntity[] = [];

  constructor(
    private readonly careersService: CareersService,
    private readonly rolesService: RolesService,
    private readonly cataloguesService: CataloguesService,
    private readonly institutionsService: InstitutionsService,
    private readonly informationStudentsService: InformationStudentsService,
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private readonly userRepository: Repository<UserEntity>,
    @Inject(CoreRepositoryEnum.STUDENT_REPOSITORY) private readonly studentRepository: Repository<StudentEntity>,
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
    this.yesNo = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.YES_NO);

  }

  async importStudents(file: Express.Multer.File) {
    try {
      await this.loadInstitutions();
      await this.loadCareers();
      await this.loadRoles();
      await this.loadCatalogues();

      const studentRole = this.roles.find(role => role.code === RoleEnum.STUDENT);
      const institution = this.institutions[0];

      const path = join(process.cwd(), 'storage/imports', file.filename);

      const workbook = XLSX.readFile(path);
      const workbookSheets = workbook.SheetNames;
      const sheet = workbookSheets[0];
      const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

      this.row = 1;

      for (const item of dataExcel) {

        this.row++;
        console.log("-----------------------------")
        console.log(this.row)

        const career = this.careers.find(career => career.code === item['Codigo_Carrera']);
        //console.log(career)

        if(!career){
          this.errors.push({
            row: this.row,
            column:'Codigo_Carrera',
            observation: `'Codigo_Carrera' no válido`,
          });
        }
        let user: any = await this.userRepository.findOne({ where: { identification: item['Numero_Documento'] } });
        //console.log(user)
        console.log(item['Numero_Documento'])
        if (!user) {
          user =
            {
              identificationType: this.identificationTypes[0],
              identification: item['Numero_Documento'],
              institutions: [institution],
              cellPhone: item['Telefono'],
              email: item['Correo'],
              lastname: item['Apellidos'],
              name: item['Nombres'],
              password: item['Numero_Documento'],
              passwordChanged: false,
              personalEmail: item['Correo'],
              roles: [studentRole],
              username: item['Numero_Documento'],
              careers: [career],
            };
        }
        console.log(user)
        const userCreated = await this.userRepository.save(user);

        let student: any = await this.studentRepository.findOne({ where: { userId: userCreated.id } });

        if (!student) {
          student = this.studentRepository.create();
          student.userId = userCreated.id;
          student.careers = [career];
          student.informationStudent = userCreated.id;

          const studentCreated = await this.studentRepository.save(student);

          let isLostGratuity = null;

          if (item['Tiene_Gratuidad'].toLowerCase() === 'si') {
            isLostGratuity = this.yesNo.find(item => item.code === '1');
          } else {
            isLostGratuity = this.yesNo.find(item => item.code === '2');
          }

          await this.informationStudentsService.create({ student: studentCreated, isLostGratuity });
        }
      }

      fs.unlinkSync(join(process.cwd(), 'storage/imports', file.filename));

      if (this.errors.concat.length > 0)
        throw new BadRequestException();

    } catch (err) {
      throw new BadRequestException('Problemas al subir el archivo, por favor verifique los errores'+ err);
    }
  }

  async generateErrorReport() {


    const data = this.errors.map(error => {
      return {
        'Fila': error.row,
        'Columna': error.column,
        'Observación': error.observation,
      };
    });

    const newWorkbook = XLSX.utils.book_new();
    const newSheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Errores');
    const path = join(process.cwd(), 'storage/reports/students', 'students.xlsx'); //review path
    XLSX.writeFile(newWorkbook, path);

    return path;
  }
}
