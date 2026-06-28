import { BadRequestException, Inject, Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CareerEntity,
  CatalogueEntity,
  SubjectEntity,
} from '@core/entities';
import { CatalogueTypeEnum, CoreRepositoryEnum } from '@shared/enums';
import { join } from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { CataloguesService } from '@core/services';

interface ErrorModel {
  row: number;
  column: string;
  observation: string;
}

@Injectable()
export class SubjectsService {
  private gradeErrors: ErrorModel[] = [];
  private attendanceErrors: ErrorModel[] = [];
  private partialPermissionErrors: ErrorModel[] = [];
  private row = 1;
  private academicPeriods: CatalogueEntity[] = [];
  private states: CatalogueEntity[] = [];
  private types: CatalogueEntity[] = [];
  private subjects: SubjectEntity[] = [];
  private careers: CareerEntity[] = [];

  constructor(
    private readonly cataloguesService: CataloguesService,
    @Inject(CoreRepositoryEnum.CAREER_REPOSITORY) private readonly careerRepository: Repository<CareerEntity>,
    @Inject(CoreRepositoryEnum.SUBJECT_REPOSITORY) private readonly subjectRepository: Repository<SubjectEntity>,
  ) {
  }

  async loadCareers() {
    this.careers = (await this.careerRepository.find({ relations: { curriculum: true } }));
  }

  async loadSubjects() {
    this.subjects = (await this.subjectRepository.find({ relations: { type: true } }));
  }

  async loadCatalogues() {
    const catalogues = (await this.cataloguesService.findAll()).data as CatalogueEntity[];
    this.academicPeriods = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ACADEMIC_PERIOD);
    this.states = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.SUBJECTS_STATE);
    this.types = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.SUBJECTS_TYPE);
  }

  async importSubjects(file: Express.Multer.File, payload: any) {
    try {
      await this.loadCareers();
      await this.loadSubjects();
      await this.loadCatalogues();

      const path = join(process.cwd(), 'storage/imports', file.filename);

      const workbook = XLSX.readFile(path);
      const workbookSheets = workbook.SheetNames;
      const sheet = workbookSheets[0];
      const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

      this.row = 1;

      const state = this.states.find(state => state.code === 'enabled');

      for (const item of dataExcel) {
        this.row++;
        const career = this.careers.find(career => career.code === item['Codigo_Carrera']);
        const subject = this.subjects.find(subject => subject.code === item['Codigo_Asignatura']);
        const academicPeriod = this.academicPeriods.find(academicPeriod => academicPeriod.code == item['Nivel']);

        let type = null;
        if (item['Nivel'] == 'leveling') {
          type = this.types.find(type => type.code === 'leveling');
        } else {
          type = this.types.find(type => type.code === 'subject');
        }

        if (!subject) {
          const newSubject =
            {
              academicPeriodId: academicPeriod.id,
              curriculumId: career.curriculum.id,
              stateId: state.id,
              typeId: type.id,
              autonomousHour: 0,
              code: item['Codigo_Asignatura'],
              credits: 0,
              name: item['Nombre_Asignatura'],
              practicalHour: 0,
              scale: 1,
              teacherHour: 0,
              isVisible: item['Nivel'] == 'leveling',
            };

          await this.subjectRepository.save(newSubject);
        } else {
          const subjectUpdate = this.subjectRepository.create(subject);

          subjectUpdate.typeId = type.id;

          if (item['Nivel'] === 'leveling') {
            subjectUpdate.isVisible = false;
          }

          await this.subjectRepository.save(subjectUpdate);
        }
      }

      fs.unlinkSync(join(process.cwd(), 'storage/imports', file.filename));

      if ((this.gradeErrors.concat(this.attendanceErrors, this.partialPermissionErrors)).length > 0)
        throw new BadRequestException();

    } catch (err) {
      throw new BadRequestException('Problemas al subir el archivo, por favor verifique los errores');
    }
  }
}
