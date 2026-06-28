import {Injectable} from '@nestjs/common';
import {faker} from '@faker-js/faker';
import {CreateEnrollmentsDetailDto, CreateEnrollmentDto, SeedEnrollmentStateDto} from '@core/dto';
import {
    CataloguesService,
    EnrollmentsService,
    EnrollmentDetailsService,
    SchoolPeriodsService,
    SubjectsService, CareersService, EnrollmentStatesService,
} from '@core/services';
import {
    CareerEntity,
    CatalogueEntity,
    EnrollmentEntity,
    SchoolPeriodEntity,
    StudentEntity,
    SubjectEntity
} from '@core/entities';
import {CatalogueEnrollmentStateEnum, CatalogueTypeEnum} from '@shared/enums';
import { StudentsService } from '../../modules/core/services/students.service';
import { UsersService } from '../../modules/auth/services/users.service';

@Injectable()
export class EnrollmentSeeder {
    private periods: CatalogueEntity[] = [];
    private parallels: CatalogueEntity[] = [];
    private types: CatalogueEntity[] = [];
    private states: CatalogueEntity[] = [];
    private workdays: CatalogueEntity[] = [];
    private careers: CareerEntity[] = [];
    private students: StudentEntity[] = [];
    private schoolPeriods: SchoolPeriodEntity[] = [];
    private enrollments: EnrollmentEntity[] = [];
    private academicStates: CatalogueEntity[] = [];
    private subjects: SubjectEntity[] = [];

    constructor(
        private readonly careersService: CareersService,
        private readonly studentsService: StudentsService,
        private readonly enrollmentsService: EnrollmentsService,
        private readonly schoolPeriodsService: SchoolPeriodsService,
        private readonly catalogueService: CataloguesService,
        private readonly enrollmentsDetailService: EnrollmentDetailsService,
        private readonly enrollmentsStateService: EnrollmentStatesService,
        private readonly subjectsService: SubjectsService,
        private readonly usersService: UsersService,
    ) {
    }

    async run() {
        await this.loadCatalogues();
        await this.loadCareers();
        await this.loadSchoolPeriods();
        await this.loadStudents();
        await this.loadSubjects();
        await this.createEnrollments();
        await this.createEnrollmentsDetails();
        await this.createEnrollmentsStates();
    }

    private async loadCatalogues() {
        const catalogues = (await this.catalogueService.findAll()).data as CatalogueEntity[];

        this.states = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

        this.types = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ENROLLMENTS_TYPE);

        this.periods = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ACADEMIC_PERIOD);

        this.parallels = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.PARALLEL);

        this.workdays = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ENROLLMENTS_WORKDAY);

        this.academicStates = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.ENROLLMENTS_ACADEMIC_STATE);
    }

    private async loadCareers() {
        this.careers = (await this.careersService.findAll()).data;
    }

    private async loadSchoolPeriods() {
        this.schoolPeriods = (await this.schoolPeriodsService.findAll()).data;
    }

    private async loadStudents() {
        this.students = (await this.studentsService.findAll()).data;
    }

    private async loadSubjects() {
        this.subjects = (await this.subjectsService.findAll()).data as SubjectEntity[];
    }

    private async createEnrollments() {
        const enrollments: CreateEnrollmentDto[] = [];

        //states
        const state = this.states.find((state: CatalogueEntity) => {
            return state.code === 'registered' && state.type === CatalogueTypeEnum.ENROLLMENT_STATE;
        });

        //curriculums
        const career = this.careers[0];

        //parallel
        const parallel = this.parallels.find(parallel => {
            return parallel.code === 'a' && parallel.type === CatalogueTypeEnum.PARALLEL;
        });

        //workday
        const workday = this.workdays.find(workday => {
            return workday.code === 'm' && workday.type === CatalogueTypeEnum.ENROLLMENTS_WORKDAY;
        });

        //students
        const student1 = this.students[0];
        const student2 = this.students[1];

        //school periods
        const schoolPeriod = this.schoolPeriods.find((schoolPeriod: SchoolPeriodEntity) => schoolPeriod.code === 'cod1');

        //enrollment type
        const type = this.types.find(type => {
            return type.code === 'ordinary' && type.type === CatalogueTypeEnum.ENROLLMENTS_TYPE;
        });

        //Periodo academico
        const first = this.periods.find((period: CatalogueEntity) => {
            return period.code === '1' && period.type === CatalogueTypeEnum.ACADEMIC_PERIOD;
        });
        const second = this.periods.find((period: CatalogueEntity) => {
            return period.code === '2' && period.type === CatalogueTypeEnum.ACADEMIC_PERIOD;
        });

        enrollments.push(
            {
                code: 'cod1',
                // date: new Date('2023-08-14'),
                enrollmentDetails: [],
                // applicationsAt: new Date('2023-08-14'),
                // folio: faker.string.alphanumeric(),
                observation: 'No hay obsevaciones',
                student: student1,
                academicPeriod: first,
                career: career,
                parallel: parallel,
                schoolPeriod: schoolPeriod,
                type: type,
                workday: workday
            },
            {
                enrollmentDetails: [],
                code: 'cod2',
                // date: new Date('2023-08-14'),
                // applicationsAt: new Date('2023-08-14'),
                // folio: faker.string.alphanumeric(),
                observation: 'No hay obsevaciones',
                student: student2,
                academicPeriod: second,
                career: career,
                parallel: parallel,
                schoolPeriod: schoolPeriod,
                type: type,
                workday: workday
            },
        );

        for (const enrollment of enrollments) {
            await this.enrollmentsService.create(enrollment);
        }
    }

    private async createEnrollmentsDetails() {

    }

    private async createEnrollmentsStates() {
        const enrollmentStates: SeedEnrollmentStateDto[] = [];

        //enrollments
        this.enrollments = (await this.enrollmentsService.findAll()).data;
        const enrollment1 = this.enrollments.find((enrollment: EnrollmentEntity) => enrollment.code === 'cod1');
        const enrollment2 = this.enrollments.find((enrollment: EnrollmentEntity) => enrollment.code === 'cod2');

        //states
        const registeredState = this.states.find((state: CatalogueEntity) => {
            return state.code === CatalogueEnrollmentStateEnum.REGISTERED && state.type === CatalogueTypeEnum.ENROLLMENT_STATE;
        });

        const requestSentState = this.states.find((state: CatalogueEntity) => {
            return state.code === CatalogueEnrollmentStateEnum.REQUEST_SENT && state.type === CatalogueTypeEnum.ENROLLMENT_STATE;
        });

        const approvedState = this.states.find((state: CatalogueEntity) => {
            return state.code === CatalogueEnrollmentStateEnum.APPROVED && state.type === CatalogueTypeEnum.ENROLLMENT_STATE;
        });

        const enrolledState = this.states.find((state: CatalogueEntity) => {
            return state.code === CatalogueEnrollmentStateEnum.ENROLLED && state.type === CatalogueTypeEnum.ENROLLMENT_STATE;
        });

        const user = (await this.usersService.findAll()).data[0];

        enrollmentStates.push(
            {
                enrollmentId: enrollment1.id,
                stateId: registeredState.id,
                userId: user.id,
            },
            {
                enrollmentId: enrollment1.id,
                stateId: requestSentState.id,
                userId: user.id,
            },
            // {
            //     enrollmentId: enrollment1.id,
            //     stateId: approvedState.id,
            //     userId:user.id,
            // },
            // {
            //     enrollmentId: enrollment1.id,
            //     stateId: enrolledState.id,
            //     userId:user.id,
            // },
            {
                enrollmentId: enrollment2.id,
                stateId: registeredState.id,
                userId:user.id,
            },
            // {
            //     enrollmentId: enrollment2.id,
            //     stateId: approvedState.id,
            //     userId:user.id,
            // }
        );

        for (const item of enrollmentStates) {
            await this.enrollmentsStateService.create({
                enrollmentId: item.enrollmentId,
                stateId: item.stateId,
                userId: item.userId,
            });
        }
    }
}
