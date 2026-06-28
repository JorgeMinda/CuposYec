import {Injectable} from '@nestjs/common';
import {faker} from '@faker-js/faker';
import {SeedTeacherDistributionDto} from '@core/dto';
import {CatalogueEntity} from '@core/entities';
import {
    CataloguesService,
    CurriculumsService,
    SchoolPeriodsService,
    SubjectsService,
    TeacherDistributionsService
} from '@core/services';
import {CatalogueTypeEnum} from '@shared/enums';
import { TeachersService } from '../../modules/core/services/teachers.service';

@Injectable()
export class TeacherDistributionsSeeder {
    constructor(
        private schoolPeriodsService: SchoolPeriodsService,
        private cataloguesService: CataloguesService,
        private subjectsService: SubjectsService,
        private curriculumsService: CurriculumsService,
        private teachersService: TeachersService,
        private teacherDistributionsService: TeacherDistributionsService,
    ) {
    }

    async run() {
        await this.create();
    }

    private async create() {
        const teacherDistributions: SeedTeacherDistributionDto[] = [];

        const catalogues = await this.cataloguesService.findCache();
        const parallels = catalogues.filter((item: CatalogueEntity) => item.type === CatalogueTypeEnum.PARALLEL);
        const workdays = catalogues.filter((item: CatalogueEntity) => item.type === CatalogueTypeEnum.ENROLLMENTS_WORKDAY);
        const schoolPeriod = await this.schoolPeriodsService.findOpenSchoolPeriod();
        const curriculums = (await this.curriculumsService.findAll()).data;
        const subjects = await this.subjectsService.findAllSubjectsByCurriculum(curriculums[0].id);
        const teachers = (await this.teachersService.findAll());

        subjects.forEach(subject => {
            workdays.forEach(workday => {
                parallels.forEach(parallel => {
                    teacherDistributions.push({
                        parallel,
                        subject,
                        workday,
                        capacity: 1,
                        schoolPeriod: schoolPeriod
                    });
                });
            });
        });

        for (const item of teacherDistributions) {
            await this.teacherDistributionsService.create(item);
        }
    }
}
