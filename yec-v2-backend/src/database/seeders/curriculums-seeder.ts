import {Injectable} from '@nestjs/common';
import {faker} from '@faker-js/faker';
import {SeedCurriculumDto} from '@core/dto';
import {CareerEntity} from '@core/entities';
import {CataloguesService, CareersService, CurriculumsService} from '@core/services';
import {CatalogueTypeEnum} from '@shared/enums';

@Injectable()
export class CurriculumsSeeder {
    constructor(private cataloguesService: CataloguesService, private careersService: CareersService, private curriculumsService: CurriculumsService) {
    }

    async run() {
        await this.create();
    }

    private async create() {
        const curriculums: SeedCurriculumDto[] = [];

        const catalogues = await this.cataloguesService.findCache();
        const careers = (await this.careersService.findAll()).data;

        const stateEnabled = catalogues.find(state => {
            return state.code === 'enabled' && state.type === CatalogueTypeEnum.CURRICULUMS_STATE;
        });

        const career1 = careers.find((career: CareerEntity) => career.code === '650811G01-S-1701');
        const career2 = careers.find((career: CareerEntity) => career.code === '650321H01-H-1701');
        const career3 = careers.find((career: CareerEntity) => career.code === '650331C01-S-1701');
        const career4 = careers.find((career: CareerEntity) => career.code === '650311D01-H-1701');
        const career5 = careers.find((career: CareerEntity) => career.code === '650112B01-S-1701');
        const career6 = careers.find((career: CareerEntity) => career.code === '650314H01-S-1701');
        const career7 = careers.find((career: CareerEntity) => career.code === '650314H01-H-1701');
        const career8 = careers.find((career: CareerEntity) => career.code === '651015D01-H-1701');

        curriculums.push(
            {
                career: career1,
                code: 'AYSA2021',
                name: 'Malla Curricular 2023',
                periodicAcademicNumber: 9,
                weeksNumber: 20,
                description: '',
                resolutionNumber: '',
                state: stateEnabled,
                isVisible: true,
            },
            {
                career: career2,
                code: 'CCNT2022',
                name: 'Malla Curricular 2023',
                periodicAcademicNumber: 8,
                weeksNumber: 20,
                description: '',
                resolutionNumber: '',
                state: stateEnabled,
                isVisible: true,
            },
            {
                career: career3,
                code: 'DEPJ2021',
                name: 'Malla Curricular 2023',
                periodicAcademicNumber: 10,
                weeksNumber: 20,
                description: '',
                resolutionNumber: '',
                state: stateEnabled,
                isVisible: true,
            },
            {
                career: career4,
                code: 'ESSC2023',
                name: 'Malla Curricular 2023',
                periodicAcademicNumber: 8,
                weeksNumber: 20,
                description: '',
                resolutionNumber: '',
                state: stateEnabled,
                isVisible: true,
            },
            {
                career: career5,
                code: 'GDIFC2021',
                name: 'Malla Curricular 2023',
                periodicAcademicNumber: 8,
                weeksNumber: 20,
                description: '',
                resolutionNumber: '',
                state: stateEnabled,
                isVisible: true,
            },
            {
                career: career6,
                code: 'LYC2021',
                name: 'Malla Curricular 2023',
                periodicAcademicNumber: 8,
                weeksNumber: 20,
                description: '',
                resolutionNumber: '',
                state: stateEnabled,
                isVisible: true,
            },
            {
                career: career7,
                code: 'SAAIC2023',
                name: 'Malla Curricular 2023',
                periodicAcademicNumber: 8,
                weeksNumber: 20,
                description: '',
                resolutionNumber: '',
                state: stateEnabled,
                isVisible: true,
            },
            {
                career: career8,
                code: 'TRSI2023',
                name: 'Malla Curricular 2023',
                periodicAcademicNumber: 8,
                weeksNumber: 20,
                description: '',
                resolutionNumber: '',
                state: stateEnabled,
                isVisible: true,
            },

        );

        for (const curriculum of curriculums) {
            await this.curriculumsService.create(curriculum);
        }
    }
}
