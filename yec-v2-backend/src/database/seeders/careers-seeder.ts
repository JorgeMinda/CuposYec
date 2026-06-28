import {Injectable} from '@nestjs/common';
import {SeedCareerDto} from '@core/dto';
import {CareerParallelsService, CareersService, CataloguesService, InstitutionsService} from '@core/services';
import {CatalogueCareersModalityEnum, CatalogueTypeEnum} from '@shared/enums';
import {CareerEntity, CatalogueEntity, CareerAcademicPeriodsEntity, InstitutionEntity} from '@core/entities';
import * as XLSX from "xlsx";
import {join} from "path";

@Injectable()
export class CareersSeeder {
    constructor(private institutionsService: InstitutionsService,
                private cataloguesService: CataloguesService,
                private careersService: CareersService,
                private careerParallelsService: CareerParallelsService
    ) {
    }

    async run() {
        await this.create();
        await this.createParallels();
    }

    private async create() {
        const careers: SeedCareerDto[] = [];

        const catalogues = await this.cataloguesService.findCache();

        const institutions = (await this.institutionsService.findAll()).data;

        const stateEnabled = catalogues.find((state: CatalogueEntity) => {
            return state.code === 'enabled' && state.type === CatalogueTypeEnum.CAREERS_STATE;
        });

        const modality1 = catalogues.find((modality: CatalogueEntity) => {
            return modality.code === CatalogueCareersModalityEnum.SEMI_ON_SITE && modality.type === CatalogueTypeEnum.CAREER_MODALITY;
        });

        const type1 = catalogues.find((type: CatalogueEntity) => {
            return type.code === 'level_3' && type.type === CatalogueTypeEnum.CAREERS_TYPE;
        });

        const institution1 = institutions.find((institution: InstitutionEntity) => institution.code === '1068');

        for (const item of careers) {
            await this.careersService.create(item);
        }
    }

    private async createParallels() {
        const careerParallels = [];

        const catalogues = await this.cataloguesService.findCache();
        const parallels = await this.cataloguesService.catalogue(CatalogueTypeEnum.PARALLEL);
        const workdays = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ENROLLMENTS_WORKDAY);

        const careers = (await this.careersService.findAll()).data;

        const workbook = XLSX.readFile(join(process.cwd(), 'src/database/seeders/files/career_parallels.xlsx'));
        const workbookSheets = workbook.SheetNames;
        const sheet = workbookSheets[0];
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);

        for (const item of dataExcel) {
            const career = careers.find(career => career.code === item['career_code']);
            const parallel = parallels.find(career => career.code === item['parallel'].toLowerCase());
            const workday = workdays.find(career => career.code === item['workday']);

            careerParallels.push(
                {
                    careerId: career.id,
                    parallelId: parallel.id,
                    workdayId: workday.id,
                    capacity: item['capacity'],
                }
            );
        }

        for (const item of careerParallels) {
            await this.careerParallelsService.create(item);
        }
    }

// review
    private async createAcademicPeriods() {
        const careers = (await this.careersService.findAll()).data;
        const catalogues = await this.cataloguesService.findCache();
        const academicPeriods = catalogues.filter(academicPeriod => academicPeriod.type === CatalogueTypeEnum.ACADEMIC_PERIOD);
        const careerAcademicPeriods: any[] = [];

        for (const career of careers) {
            for (const catalogue of academicPeriods) {
                careerAcademicPeriods.push({career, catalogue});
            }
        }

        for (const item of careers) {
            await this.careersService.create(item);
        }
    }
}
