import {Injectable, NotFoundException, Inject} from '@nestjs/common';
import {Repository, SelectQueryBuilder} from 'typeorm';
import {StudentEvaluationEntity} from '../entities/student-evaluation.entity';
import {CatalogueTypeEnum, CoreRepositoryEnum, TeacherEvaluationRepositoryEnum} from '@shared/enums';
import {AutoEvaluationEntity} from '../entities/auto-evaluation.entity';
import {
    CareerEntity,
    CatalogueEntity,
    EnrollmentDetailEntity,
    EnrollmentDetailStateEntity,
    EnrollmentEntity,
    EnrollmentStateEntity,
    StudentEntity, SubjectEntity,
    TeacherDistributionEntity,
} from '@core/entities';
import {UserEntity} from '@auth/entities';
import {CataloguesService} from '@core/services';
import * as XLSX from 'xlsx';
import {join} from 'path';
import {en} from '@faker-js/faker';

interface ErrorModel {
    parallel: string;
    workday: string;
    subjectCode: string;
    subjectName: string;
    userIdentification: string;
    userLastname: string;
    userName: string;
}

@Injectable()
export class StudentEvaluationService {
    private errors: ErrorModel[] = [];

    constructor(
        @Inject(TeacherEvaluationRepositoryEnum.STUDENT_EVALUATION_REPOSITORY) private readonly repository: Repository<StudentEvaluationEntity>,
        @Inject(CoreRepositoryEnum.ENROLLMENT_REPOSITORY) private readonly enrollmentRepository: Repository<EnrollmentEntity>,
        @Inject(CoreRepositoryEnum.TEACHER_DISTRIBUTION_REPOSITORY) private readonly teacherDistributionRepository: Repository<TeacherDistributionEntity>,
        private readonly catalogueService: CataloguesService,
    ) {
    }

    async update(id: string, payload: any): Promise<AutoEvaluationEntity[]> {
        const evaluation = await this.repository.findOneBy({id});

        if (!evaluation) {
            throw new NotFoundException('Evaluación por pares no encontrada');
        }

        return this.repository.save(payload);
    }

    async findOne(id: string): Promise<StudentEvaluationEntity> {
        return await this.repository.findOne(
            {
                relations: {evaluated: true, evaluator: true, evaluationType: true},
                where: {id},
            });
    }

    async findStudentEvaluationByEvaluator(enrollmentDetailId: string): Promise<StudentEvaluationEntity> {
        return await this.repository.findOne(
            {
                relations: {evaluated: true, evaluator: true, evaluationType: true},
                where: {enrollmentDetailId},
            });
    }

    async findStudentEvaluationsByEvaluator(evaluatorId: string, schoolPeriodId: string): Promise<StudentEvaluationEntity[]> {
        return await this.repository.find(
            {
                relations: {
                    enrollmentDetail: {subject: true},
                    evaluator: true,
                    evaluated: true,
                    evaluationType: true,
                },
                where: {evaluatorId, schoolPeriodId},
            });
    }

    async generateStudentEvaluations(schoolPeriodId: string): Promise<StudentEvaluationEntity[]> {
        const evaluationTypes = await this.catalogueService.findByType(CatalogueTypeEnum.QUESTIONS_EVALUATION_TYPE);
        const evaluationType = evaluationTypes.find(evaluationType => evaluationType.code === 'student');

        const enrollmentDetails = await this.findEnrollmentDetailsBySchoolPeriod(schoolPeriodId);

        const studentEvaluations = [];

        this.errors = [];

        for (const enrollmentDetail of enrollmentDetails) {
            const teacherDistribution = await this.teacherDistributionRepository.findOne({
                relations: {teacher: true},
                where: {
                    parallelId: enrollmentDetail.parallelId,
                    workdayId: enrollmentDetail.workdayId,
                    subjectId: enrollmentDetail.subjectId,
                    schoolPeriodId: schoolPeriodId,
                },
            });

            if (teacherDistribution) {
                let studentEvaluation = await this.repository.findOne({
                    where: {
                        enrollmentDetailId: enrollmentDetail.id,
                    },
                });

                if (!studentEvaluation) {
                    studentEvaluation = this.repository.create();
                    studentEvaluation.enrollmentDetailId = enrollmentDetail.id;
                    studentEvaluation.evaluationTypeId = evaluationType.id;
                    studentEvaluation.evaluatedId = teacherDistribution.teacher.userId;
                    studentEvaluation.evaluatorId = enrollmentDetail.userId;
                    studentEvaluation.schoolPeriodId = schoolPeriodId;
                    studentEvaluations.push(studentEvaluation);
                }
            } else {
                this.errors.push({
                        parallel: enrollmentDetail.parallelName,
                        workday: enrollmentDetail.workdayName,
                        subjectCode: enrollmentDetail.subjectCode,
                        subjectName: enrollmentDetail.subjectName,
                        userIdentification: enrollmentDetail.userIdentification,
                        userLastname: enrollmentDetail.userLastname,
                        userName: enrollmentDetail.userName,
                    },
                );
            }
        }

        if (this.errors.length > 0) {
            await this.generateErrorReport();
        }

        return await this.repository.save(studentEvaluations);
    }

    private async findEnrollmentDetailsBySchoolPeriod(schoolPeriodId: string): Promise<any[]> {
        const queryBuilder: SelectQueryBuilder<EnrollmentEntity> = this.enrollmentRepository.createQueryBuilder('enrollments');

        queryBuilder.select(
            [
                'users.id as "userId"',
                'users.identification as "userIdentification"',
                'users.lastname as "userLastname"',
                'users.name as "userName"',
                'enrollment_details.id as "id"',
                'enrollment_details.parallel_id as "parallelId"',
                'parallels.name as "parallelName"',
                'enrollment_details.workday_id as "workdayId"',
                'workdays.name as "workdayName"',
                'enrollment_details.subject_id as "subjectId"',
                'subjects.code as "subjectCode"',
                'subjects.name as "subjectName"',
            ])
            .innerJoin(EnrollmentStateEntity, 'enrollment_states', 'enrollment_states.enrollment_id = enrollments.id')
            .innerJoin(CatalogueEntity, 'states', 'states.id = enrollment_states.state_id')
            .innerJoin(CareerEntity, 'careers', 'careers.id = enrollments.career_id')
            .innerJoin(StudentEntity, 'students', 'students.id = enrollments.student_id')
            .innerJoin(UserEntity, 'users', 'users.id = students.user_id')
            .innerJoin(EnrollmentDetailEntity, 'enrollment_details', 'enrollment_details.enrollment_id = enrollments.id')
            .innerJoin(EnrollmentDetailStateEntity, 'enrollment_detail_states', 'enrollment_detail_states.enrollment_detail_id = enrollment_details.id')
            .innerJoin(CatalogueEntity, 'detail_states', 'detail_states.id = enrollment_detail_states.state_id')
            .innerJoin(CatalogueEntity, 'parallels', 'parallels.id = enrollment_details.parallel_id')
            .innerJoin(CatalogueEntity, 'workdays', 'workdays.id = enrollment_details.workday_id')
            .innerJoin(SubjectEntity, 'subjects', 'subjects.id = enrollment_details.subject_id')
            .where(
                `enrollments.school_period_id = :schoolPeriodId 
                AND enrollment_states.deleted_at is null 
                AND enrollment_detail_states.deleted_at is null 
                AND enrollments.deleted_at IS NULL
                AND states.code = :stateCode  
                AND detail_states.code = :stateCode`, {
                    schoolPeriodId, stateCode: 'enrolled',
                });

        return await queryBuilder.getRawMany();
    }

    private async generateErrorReport() {
        const errors = this.errors;

        const data = errors.map(error => {
            return {
                'Jornada': error.workday,
                'Paralelo': error.parallel,
                'Código Asignatura': error.subjectCode,
                'Asignatura': error.subjectName,
                'Identificación': error.userIdentification,
                'Apellidos': error.userLastname,
                'Nombres': error.userName,
            };
        });

        const newWorkbook = XLSX.utils.book_new();
        const newSheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(newWorkbook, newSheet, 'Errores');
        const path = join(process.cwd(), 'storage/reports/student-evaluations', new Date().getTime() + '.xlsx'); //review path
        XLSX.writeFile(newWorkbook, path);

        return path;
    }
}