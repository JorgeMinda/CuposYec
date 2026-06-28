import {BadRequestException, Inject, Injectable} from '@nestjs/common';
import {Repository} from 'typeorm';
import {
    CareerEntity, CareerToTeacherEntity,
    CatalogueEntity,
    InstitutionEntity, PartialEntity,
    SchoolPeriodEntity,
    SubjectEntity,
    TeacherEntity,
} from '@core/entities';
import {AuthRepositoryEnum, CoreRepositoryEnum} from '@shared/enums';
import {join} from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import {UserEntity} from '@auth/entities';
import {CareersService, InstitutionsService} from '@core/services';

enum ColumnsEnum {
    CAREER_CODE = 'codigo_carrera',
    IDENTIFICATION = 'cedula',
}

interface ErrorModel {
    row: number;
    column: string;
    observation: string;
}

@Injectable()
export class CareerTeacherAssignmentsService {
    private errors: ErrorModel[] = [];
    private attendanceErrors: ErrorModel[] = [];
    private row = 1;
    private careers: CareerEntity[] = [];
    private institutions: InstitutionEntity[] = [];

    constructor(
        private readonly careersService: CareersService,
        private readonly institutionsService: InstitutionsService,
        @Inject(AuthRepositoryEnum.USER_REPOSITORY) private readonly userRepository: Repository<UserEntity>,
        @Inject(CoreRepositoryEnum.TEACHER_REPOSITORY) private readonly teacherRepository: Repository<TeacherEntity>,
        @Inject(CoreRepositoryEnum.CAREER_TO_TEACHER_REPOSITORY) private readonly careerToTeacherRepository: Repository<CareerToTeacherEntity>,
    ) {
    }

    async loadInstitutions() {
        this.institutions = (await this.institutionsService.findAll()).data;
    }

    async loadCareers() {
        this.careers = (await this.careersService.findCareersByInstitution(this.institutions[0].id)).data;
    }

    async import(file: Express.Multer.File) {
        try {
            const path = join(process.cwd(), 'storage/imports', file.filename);
            const workbook = XLSX.readFile(path);
            const workbookSheets = workbook.SheetNames;
            const sheet = workbookSheets[0];
            const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

            await this.loadInstitutions();
            await this.loadCareers();

            this.row = 1;

            for (const item of dataExcel) {
                this.row++;

                const career = this.careers.find(workday => workday.code.toLowerCase() === item[ColumnsEnum.CAREER_CODE].trim().toLowerCase());
                const user = await this.userRepository.findOne({
                    relations: {teacher: true},
                    where: {identification: item[ColumnsEnum.IDENTIFICATION].toString().trim()},
                });

                if (career && user) {
                    const careerToTeacher = await this.careerToTeacherRepository.findOne({
                        where: {
                            teacherId: user.teacher.id,
                            careerId: career.id,
                        },
                    });

                    if (careerToTeacher) {
                        careerToTeacher.isCurrent = true;
                        await this.careerToTeacherRepository.update(careerToTeacher.id, careerToTeacher);
                    }
                }
            }

            fs.unlinkSync(join(process.cwd(), 'storage/imports', file.filename));
        } catch (err) {
            throw new BadRequestException('Problemas al subir el archivo, por favor verifique los errores');
        }
    }
}
