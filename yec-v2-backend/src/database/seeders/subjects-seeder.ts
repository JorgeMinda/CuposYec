import {Injectable} from '@nestjs/common';
import * as XLSX from 'xlsx';
import {faker} from '@faker-js/faker';
import {join} from 'path';
import {SeedSubjectDto} from '@core/dto';
import {CatalogueEntity, CurriculumEntity} from '@core/entities';
import {
    CareersService,
    CataloguesService,
    CurriculumsService,
    SubjectCorequisitesService,
    SubjectPrerequisitesService,
    SubjectsService
} from '@core/services';
import {CatalogueTypeEnum} from '@shared/enums';

@Injectable()
export class SubjectsSeeder {
    private states: CatalogueEntity[] = [];
    private periods: CatalogueEntity[] = [];
    private types: CatalogueEntity[] = [];
    private curriculums: CurriculumEntity[] = [];

    constructor(
        private subjectService: SubjectsService,
        private subjectCorequisitesService: SubjectCorequisitesService,
        private subjectRequirementsService: SubjectPrerequisitesService,
        private catalogueService: CataloguesService,
        private careersService: CareersService,
        private curriculumsService: CurriculumsService,
    ) {
    }

    async run() {
        await this.loadCatalogues();
        await this.loadCurriculums();
        await this.createSubjects();
        // await this.createCorequisites();
        // await this.createPrerequisites();
    }

    private async loadCatalogues() {
        const catalogues = (await this.catalogueService.findAll()).data as CatalogueEntity[];

        this.states = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.SUBJECTS_STATE);

        this.periods = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ACADEMIC_PERIOD);

        this.types = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.SUBJECTS_TYPE);
    }

    private async loadCurriculums() {
        this.curriculums = (await this.curriculumsService.findAll()).data as CurriculumEntity[];
    }

    private async createSubjects() {
        const workbook = XLSX.readFile(join(process.cwd(), 'src/database/seeders/files/subjects.xlsx'));

        const workbookSheets = workbook.SheetNames;

        for (const sheet of workbookSheets) {

            const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

            for (const item of dataExcel) {
                const subjects: SeedSubjectDto[] = [];

                const stateEnabled = this.states.find((state: CatalogueEntity) => {
                    return state.code === 'enabled' && state.type === CatalogueTypeEnum.SUBJECTS_STATE;
                });

                const academicPeriod = this.periods.find((period: CatalogueEntity) => {
                    return period.code == item['academic_period'] && period.type === CatalogueTypeEnum.ACADEMIC_PERIOD;
                });

                const career = await this.careersService.findByCode(item['career_code']);
                const curriculum = career.curriculums[0];


                const type = this.types.find(type => {
                    return type.code === item['type'] && type.type === CatalogueTypeEnum.SUBJECTS_TYPE;
                });

                subjects.push(
                    {
                        academicPeriod: academicPeriod,
                        curriculum: curriculum,
                        type: type,
                        state: stateEnabled,
                        autonomousHour: item['ha'],
                        code: item['code'],
                        credits: 0,
                        isVisible: true,
                        isEnabled: true,
                        name: item['name'].trim(),
                        practicalHour: item['hp'],
                        scale: 1,
                        teacherHour: item['hd'],
                        subjectPrerequisites: [],
                        subjectCorequisites: [],
                    },
                );

                for (const subject of subjects) {
                    await this.subjectService.create(subject);
                }
            }
        }
    }

    private async createCorequisites() {
        const workbook = XLSX.readFile(join(process.cwd(), 'src/database/seeders/files/subject_corequisites.xlsx'));

        const workbookSheets = workbook.SheetNames;
        const sheet = workbookSheets[0];
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        for (const item of dataExcel) {
            const subject = await this.subjectService.findByCode(item['subject_code']);
            const requirement = await this.subjectService.findByCode(item['requirement_code']);

            await this.subjectCorequisitesService.createCorequisite({
                subject,
                requirement,
                isEnabled: true,
            });
        }

        return true;
    }

    private async createPrerequisites() {
        const workbook = XLSX.readFile(join(process.cwd(), 'src/database/seeders/files/subject_prerequisites.xlsx'));

        const workbookSheets = workbook.SheetNames;
        const sheet = workbookSheets[0];
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        for (const item of dataExcel) {
            const subject = await this.subjectService.findByCode(item['subject_code']);
            const requirement = await this.subjectService.findByCode(item['requirement_code']);

            await this.subjectRequirementsService.createPrerequisite({
                subject,
                requirement,
                isEnabled: true,
            });
        }

        return true;
    }
}
