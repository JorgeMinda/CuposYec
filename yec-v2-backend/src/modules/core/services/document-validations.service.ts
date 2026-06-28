import {Inject, Injectable, NotFoundException} from '@nestjs/common';
import {FindOptionsWhere, ILike, Repository} from 'typeorm';
import {
    CreateCareerDto,
    FilterCareerDto,
    FilterEnrollmentDto,
    PaginationDto,
    SeedCareerDto,
    UpdateCareerDto,
} from '@core/dto';
import {CareerEntity, CatalogueEntity, CurriculumEntity, StudentEntity, TeacherEntity} from '@core/entities';
import {
    AuthRepositoryEnum,
    CatalogueEnrollmentStateEnum,
    CatalogueTypeEnum,
    CoreRepositoryEnum,
    MessageEnum
} from '@shared/enums';
import {ServiceResponseHttpModel} from '@shared/models';
import {UserEntity} from '@auth/entities';
import {CataloguesService} from "./catalogues.service";

@Injectable()
export class DocumentValidationsService {
    constructor(
        @Inject(CoreRepositoryEnum.STUDENT_REPOSITORY) private studentRepository: Repository<StudentEntity>,
        @Inject(AuthRepositoryEnum.USER_REPOSITORY) private userRepository: Repository<UserEntity>,
        private readonly cataloguesService: CataloguesService,
    ) {
    }

    async studentCard(studentId: string, careerId: string, schoolPeriodId: string) {
        const catalogues = await this.cataloguesService.findCache();
        const enrollmentStateEnrolled = catalogues.find(catalogue => catalogue.code === CatalogueEnrollmentStateEnum.ENROLLED && catalogue.type === CatalogueTypeEnum.ENROLLMENT_STATE);

        const student = await this.studentRepository.findOne({
            relations: {
                informationStudent: {town: true, indigenousNationality: true},
                enrollment: {career: true},
                user: {
                    ethnicOrigin: true,
                    sex: true,
                    residenceAddress: {
                        province: true,
                        canton: true,
                    },
                },
            },
            where: {
                id: studentId,
                enrollments: {careerId, schoolPeriodId, enrollmentStates: {stateId: enrollmentStateEnrolled.id}},
            },
        });

        if (!student) {
            throw new NotFoundException('Estudiante no encontrado');
        }

        return student;
    }
}
