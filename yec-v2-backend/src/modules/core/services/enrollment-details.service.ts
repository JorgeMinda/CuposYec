import {BadRequestException, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {Repository, FindOptionsWhere, ILike, LessThan, In} from 'typeorm';
import {CreateEnrollmentsDetailDto, FilterEnrollmentsDetailDto, UpdateEnrollmentsDetailDto} from '@core/dto';
import {CatalogueEntity, EnrollmentDetailEntity} from '@core/entities';
import {PaginationDto} from '@core/dto';
import {CatalogueEnrollmentStateEnum, CatalogueTypeEnum, CoreRepositoryEnum} from '@shared/enums';
import {
    CataloguesService,
    EnrollmentDetailStatesService, TeacherDistributionsService,
} from '@core/services';
import {ServiceResponseHttpModel} from '@shared/models';
import {SeedEnrollmentsDetailDto} from '../dto/enrollment-details/seed-enrollment-detail.dto';

@Injectable()
export class EnrollmentDetailsService {
    constructor(
        @Inject(CoreRepositoryEnum.ENROLLMENT_DETAIL_REPOSITORY)
        private readonly repository: Repository<EnrollmentDetailEntity>,
        private readonly enrollmentDetailStatesService: EnrollmentDetailStatesService,
        private readonly cataloguesService: CataloguesService,
        private readonly teacherDistributionsService: TeacherDistributionsService,
    ) {
    }

    async create(userId: string, payload: CreateEnrollmentsDetailDto): Promise<EnrollmentDetailEntity> {
        const enrollmentDetailExist = await this.repository.find({
            where: {
                enrollmentId: payload.enrollmentId,
                subjectId: payload.subject.id
            },
        });

        if (enrollmentDetailExist.length > 0) {
            throw new BadRequestException('La asignatura ya existe, por favor ingrese otra');
        }

        const newEnrollmentDetail = this.repository.create();

        newEnrollmentDetail.enrollmentId = payload.enrollmentId;
        newEnrollmentDetail.number = payload.number;
        newEnrollmentDetail.observation = payload.observation;
        newEnrollmentDetail.parallelId = payload.parallel.id;
        newEnrollmentDetail.subjectId = payload.subject.id;
        newEnrollmentDetail.typeId = payload.type.id;
        newEnrollmentDetail.workdayId = payload.workday.id;

        return await this.repository.save(newEnrollmentDetail);
    }

    async sendRequest(userId: string, enrollmentDetailId: string, payload: CreateEnrollmentsDetailDto): Promise<EnrollmentDetailEntity> {
        const catalogues = await this.cataloguesService.findCache();

        const requestSentState = catalogues.find(catalogue =>
            catalogue.code === CatalogueEnrollmentStateEnum.REQUEST_SENT &&
            catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);


        await this.enrollmentDetailStatesService.create({
            enrollmentDetailId: enrollmentDetailId,
            stateId: requestSentState.id,
            userId,
            date: new Date(),
            observation: payload.observation,
        });

        return null;
    }

    async findAll(params?: FilterEnrollmentsDetailDto): Promise<ServiceResponseHttpModel> {
        //Pagination & Filter by search
        if (params?.limit > 0 && params?.page >= 0) {
            return await this.paginateAndFilter(params);
        }

        //Other filters
        // if (params.number) {
        //   return this.filterByNumber(params.number);
        // }

        //All
        const data = await this.repository.findAndCount({
            relations: {subject: true},
        });

        return {data: data[0], pagination: {totalItems: data[1], limit: 10}};
    }

    async findOne(id: string): Promise<EnrollmentDetailEntity> {
        const enrollmentDetail = await this.repository.findOne({
            relations: {
                subject: {academicPeriod: true},
                academicState: true,
                type: true,
                workday: true,
                parallel: true,
                enrollmentDetailStates: {state: true},
                enrollmentDetailState: {state: true},
            },
            where: {id},
        });

        if (!enrollmentDetail) {
            throw new NotFoundException('Enrollment detail not found');
        }

        return enrollmentDetail;
    }

    async update(id: string, payload: UpdateEnrollmentsDetailDto): Promise<EnrollmentDetailEntity> {
        const enrollmentDetail = await this.repository.findOneBy({id});

        if (!enrollmentDetail) {
            throw new NotFoundException('Detalle de matrícula no encontrado');
        }

        if (payload.parallel)
            enrollmentDetail.parallelId = payload.parallel.id;

        if (payload.type)
            enrollmentDetail.typeId = payload.type.id;

        if (payload.workday)
            enrollmentDetail.workdayId = payload.workday.id;

        if (payload.date)
            enrollmentDetail.date = payload.date;

        if (payload.observation)
            enrollmentDetail.observation = payload.observation;

        if (payload.finalGrade)
            enrollmentDetail.finalGrade = payload.finalGrade;

        if (payload.finalAttendance)
            enrollmentDetail.finalAttendance = payload.finalAttendance;

        if (payload.academicState)
            enrollmentDetail.academicState = payload.academicState;


        return await this.repository.save(enrollmentDetail);
    }

    async updateParallels(enrollmentId: string, parallelId: string): Promise<EnrollmentDetailEntity[]> {
        const enrollmentDetails = await this.repository.findBy({enrollmentId});

        for (const enrollmentDetail of enrollmentDetails) {
            enrollmentDetail.parallelId = parallelId;
            await this.repository.save(enrollmentDetail);
        }

        return enrollmentDetails;
    }

    async updateWorkdays(enrollmentId: string, workdayId: string): Promise<EnrollmentDetailEntity[]> {
        const enrollmentDetails = await this.repository.findBy({enrollmentId});

        for (const enrollmentDetail of enrollmentDetails) {
            enrollmentDetail.workdayId = workdayId;
            await this.repository.save(enrollmentDetail);
        }

        return enrollmentDetails;
    }

    async updateTypes(enrollmentId: string, typeId: string): Promise<EnrollmentDetailEntity[]> {
        const enrollmentDetails = await this.repository.findBy({enrollmentId});

        for (const enrollmentDetail of enrollmentDetails) {
            enrollmentDetail.typeId = typeId;
            await this.repository.save(enrollmentDetail);
        }

        return enrollmentDetails;
    }

    async remove(id: string): Promise<EnrollmentDetailEntity> {
        const enrollmentDetail = await this.repository.findOneBy({id});

        if (!enrollmentDetail) {
            throw new NotFoundException('enrollmentDetail not found');
        }

        return await this.repository.softRemove(enrollmentDetail);
    }

    async removeAll(payload: EnrollmentDetailEntity[] | CreateEnrollmentsDetailDto[]): Promise<EnrollmentDetailEntity[]> {
        return await this.repository.softRemove(payload);
    }

    private async paginateAndFilter(params: FilterEnrollmentsDetailDto): Promise<ServiceResponseHttpModel> {
        let where: FindOptionsWhere<EnrollmentDetailEntity> | FindOptionsWhere<EnrollmentDetailEntity>[];
        where = {};
        let {page, search} = params;
        const {limit} = params;

        if (search) {
            search = search.trim();
            page = 0;
            where = [];
            where.push({observation: ILike(`%${search}%`)});
        }

        const response = await this.repository.findAndCount({
            where,
            relations: {subject: true},
            skip: PaginationDto.getOffset(limit, page),
            take: limit,
        });

        return {
            data: response[0],
            pagination: {limit, totalItems: response[1]},
        };
    }

    private async filterByNumber(number: number): Promise<ServiceResponseHttpModel> {
        const where: FindOptionsWhere<EnrollmentDetailEntity> = {};

        if (number) {
            where.number = LessThan(number);
        }

        const response = await this.repository.findAndCount({
            relations: {subject: true},
            where,
        });

        return {
            data: response[0],
            pagination: {limit: 10, totalItems: response[1]},
        };
    }

    async findEnrollmentDetailsByEnrollment(enrollmentId: string): Promise<EnrollmentDetailEntity[]> {
        const response = await this.repository.find({
            relations: {
                parallel: true,
                academicState: true,
                enrollmentDetailStates: {state: true},
                enrollmentDetailState: {state: true},
                subject: {academicPeriod: true},
                type: true,
                workday: true,
            },
            where: {enrollmentId},
        });

        return response;
    }

    async findTotalEnrollmentDetails(parallelId: string, schoolPeriodId: string, workdayId: string): Promise<number> {
        const catalogues = await this.cataloguesService.findCache();
        const states = catalogues.filter((item: CatalogueEntity) => item.type === CatalogueTypeEnum.ENROLLMENT_STATE);
        const state = states.find((item: CatalogueEntity) => item.code === CatalogueEnrollmentStateEnum.REGISTERED);

        const total = await this.repository.find({
            where: {
                workdayId,
                parallelId,
                enrollment: {schoolPeriodId},
                enrollmentDetailStates: {stateId: state.id},
            },
        });

        return total.length;
    }

    async approve(id: string, userId: string, payload: UpdateEnrollmentsDetailDto): Promise<EnrollmentDetailEntity> {
        const enrollmentDetail = await this.repository.findOne({
            relations: {enrollmentDetailStates: {state: true}},
            where: {id},
        });

        if (!enrollmentDetail) {
            throw new NotFoundException('Detalle Matrícula no encontrado');
        }

        const catalogues = await this.cataloguesService.findCache();

        const approvedState = catalogues.find(catalogue =>
            catalogue.code === CatalogueEnrollmentStateEnum.APPROVED &&
            catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

        // await this.enrollmentDetailStatesService.removeRejected(enrollmentDetail.enrollmentDetailStates);
        await this.enrollmentDetailStatesService.removeAll(enrollmentDetail.enrollmentDetailStates);

        await this.enrollmentDetailStatesService.create({
            enrollmentDetailId: id,
            stateId: approvedState.id,
            userId,
            date: new Date(),
            observation: payload.observation,
        });

        return enrollmentDetail;
    }

    async reject(id: string, userId: string, payload: UpdateEnrollmentsDetailDto): Promise<EnrollmentDetailEntity> {
        const enrollmentDetail = await this.repository.findOne({
            relations: {enrollmentDetailStates: {state: true}},
            where: {id},
        });

        if (!enrollmentDetail) {
            throw new NotFoundException('Matrícula no encontrada');
        }

        const catalogues = await this.cataloguesService.findCache();

        const rejectedState = catalogues.find(catalogue =>
            catalogue.code === CatalogueEnrollmentStateEnum.REJECTED &&
            catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

        // await this.enrollmentDetailStatesService.removeRequestSent(enrollmentDetail.enrollmentDetailStates);
        await this.enrollmentDetailStatesService.removeAll(enrollmentDetail.enrollmentDetailStates);

        await this.enrollmentDetailStatesService.create({
            enrollmentDetailId: id,
            stateId: rejectedState.id,
            userId,
            date: new Date(),
            observation: payload.observation,
        });

        return enrollmentDetail;
    }

    async enroll(id: string, userId: string, payload: UpdateEnrollmentsDetailDto): Promise<EnrollmentDetailEntity> {
        const enrollmentDetail = await this.repository.findOne({
            relations: {enrollmentDetailStates: true},
            where: {id},
        });

        enrollmentDetail.date = new Date();

        await this.repository.save(enrollmentDetail);

        const catalogues = await this.cataloguesService.findCache();

        const enrolledState = catalogues.find(catalogue =>
            catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED &&
            catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

        await this.enrollmentDetailStatesService.removeAll(enrollmentDetail.enrollmentDetailStates);

        await this.enrollmentDetailStatesService.create({
            enrollmentDetailId: id,
            stateId: enrolledState.id,
            userId,
            date: new Date(),
            observation: payload.observation,
        });

        return enrollmentDetail;
    }

    async revoke(id: string, userId: string, payload: UpdateEnrollmentsDetailDto): Promise<EnrollmentDetailEntity> {
        const enrollmentDetail = await this.repository.findOne({
            relations: {enrollmentDetailStates: true},
            where: {id},
        });

        const catalogues = await this.cataloguesService.findCache();

        const revokedState = catalogues.find(catalogue =>
            catalogue.code === CatalogueEnrollmentStateEnum.REVOKED &&
            catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

        await this.enrollmentDetailStatesService.removeAll(enrollmentDetail.enrollmentDetailStates);

        await this.enrollmentDetailStatesService.create({
            enrollmentDetailId: id,
            stateId: revokedState.id,
            userId,
            date: new Date(),
            observation: payload.observation,
        });

        return enrollmentDetail;
    }

    async findEnrollmentDetailsByTeacherDistribution(teacherDistributionId: string): Promise<EnrollmentDetailEntity[]> {
        const teacherDistribution = await this.teacherDistributionsService.findOne(teacherDistributionId);

        const catalogues = await this.cataloguesService.findCache();
        const enrollmentStateEnrolled = catalogues.find(catalogue => catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED && catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

        const response = await this.repository.find({
            relations: {
                academicState: true,
                attendances: {partial: true},
                grades: {partial: true},
                parallel: true,
                enrollmentDetailState: {state: true},
                subject: {academicPeriod: true},
                type: true,
                workday: true,
                enrollment: {student: {user: true}},
            },
            where: {
                enrollment: {
                    schoolPeriodId: teacherDistribution.schoolPeriodId,
                    enrollmentState: {stateId: enrollmentStateEnrolled.id},
                },
                subjectId: teacherDistribution.subjectId,
                parallelId: teacherDistribution.parallelId,
                workdayId: teacherDistribution.workdayId,
                enrollmentDetailState: {stateId: enrollmentStateEnrolled.id},
            },
            order: {enrollment: {student: {user: {lastname: 'asc', name: 'asc'}}}},
        });

        return response;
    }

    async calculateEnrollmentDetailNumber(studentId: string, subjectId: string) {
        const catalogues = await this.cataloguesService.findCache();

        const enrolled = catalogues.find(catalogue =>
            catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED && catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

        const failed = catalogues.find(catalogue =>
            catalogue.code === 'r' && catalogue.type === CatalogueTypeEnum.ENROLLMENTS_ACADEMIC_STATE);

        return await this.repository.find({
            where: {
                academicStateId: failed.id,
                subjectId,
                enrollmentDetailState: {stateId: enrolled.id},
                enrollment: {studentId},
            },
        });
    }
}
