import { Inject, Injectable } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CatalogueEnrollmentStateEnum, CatalogueTypeEnum, CoreRepositoryEnum } from '@shared/enums';
import { CareerEntity, CatalogueEntity, EnrollmentEntity, EnrollmentStateEntity, StudentEntity } from '@core/entities';
import { CataloguesService } from './catalogues.service';
import { UserEntity } from '@auth/entities';

@Injectable()
export class DashboardsService {
  constructor(
    @Inject(CoreRepositoryEnum.ENROLLMENT_REPOSITORY) private enrollmentRepository: Repository<EnrollmentEntity>,
    private readonly cataloguesService: CataloguesService,
  ) {
  }


  async findEnrolledStudents(careerIds: string, schoolPeriodId: string): Promise<EnrollmentEntity[]> {
    const queryBuilder: SelectQueryBuilder<EnrollmentEntity> = this.enrollmentRepository.createQueryBuilder('enrollments');

    queryBuilder.select([
      'careers.name as "careerName"',
      'careers.short_name as "careerShortName"',
      'states.name as "stateName"',
      'states.code as "stateCode"',
      'count(career_id) as "total"',
    ])
      .leftJoin(CareerEntity, 'careers', 'careers.id = enrollments.career_id')
      .leftJoin(EnrollmentStateEntity, 'enrollment_states', 'enrollment_states.enrollment_id = enrollments.id')
      .leftJoin(CatalogueEntity, 'states', 'states.id = enrollment_states.state_id');

    if (careerIds) {
      queryBuilder.where("enrollments.school_period_id = :schoolPeriodId and enrollments.career_id in (:...careerIds)", {
        schoolPeriodId,
        careerIds:careerIds.split(','),
      });
    } else {
      queryBuilder.where('enrollments.school_period_id = :schoolPeriodId', { schoolPeriodId });
    }

    queryBuilder
      .groupBy('career_id, careers.name, careers.short_name,states.code,states.name')
      .orderBy('careers.name, states.name');

    return await queryBuilder.getRawMany();
  }

  async findEnrolledStudentsForSex(careerIds: string, schoolPeriodId: string): Promise<EnrollmentEntity[]> {
    const queryBuilder: SelectQueryBuilder<EnrollmentEntity> = this.enrollmentRepository.createQueryBuilder('enrollments');

    queryBuilder.select([
      'careers.name as "careerName"',
      'careers.short_name as "careerShortName"',
      'states.name as "stateName"',
      'states.code as "stateCode"',
      'sexes.code as "sexCode"',
      'sexes.name as "sexName"',
      'count(users.sex_id) as "total"',
    ])
      .leftJoin(CareerEntity, 'careers', 'careers.id = enrollments.career_id')
      .leftJoin(EnrollmentStateEntity, 'enrollment_states', 'enrollment_states.enrollment_id = enrollments.id')
      .leftJoin(CatalogueEntity, 'states', 'states.id = enrollment_states.state_id')
      .leftJoin(StudentEntity, 'students', 'students.id = enrollments.student_id')
      .leftJoin(UserEntity, 'users', 'users.id = students.user_id')
      .leftJoin(CatalogueEntity, 'sexes', 'sexes.id = users.sex_id')
    ;

    if (careerIds) {
      queryBuilder.where("enrollments.school_period_id = :schoolPeriodId and enrollments.career_id in (:...careerIds)", {
        schoolPeriodId,
        careerIds:careerIds.split(','),
      });
    } else {
      queryBuilder.where('enrollments.school_period_id = :schoolPeriodId', { schoolPeriodId });
    }

    queryBuilder
      .groupBy('career_id, careers.name, careers.short_name,states.code,states.name, users.sex_id, sexes.code, sexes.name')
      .orderBy('careers.name, states.name');

    return await queryBuilder.getRawMany();
  }

  async findEnrolledStudentsForEthnicOrigin(careerIds: string, schoolPeriodId: string): Promise<EnrollmentEntity[]> {
    const queryBuilder: SelectQueryBuilder<EnrollmentEntity> = this.enrollmentRepository.createQueryBuilder('enrollments');

    queryBuilder.select([
      'states.name as "stateName"',
      'states.code as "stateCode"',
      'ethnic_origins.code as "ethnicOriginCode"',
      'ethnic_origins.name as "ethnicOriginName"',
      'count(users.ethnic_origin_id) as "total"',
    ])
      .leftJoin(CareerEntity, 'careers', 'careers.id = enrollments.career_id')
      .leftJoin(EnrollmentStateEntity, 'enrollment_states', 'enrollment_states.enrollment_id = enrollments.id')
      .leftJoin(CatalogueEntity, 'states', 'states.id = enrollment_states.state_id')
      .leftJoin(StudentEntity, 'students', 'students.id = enrollments.student_id')
      .leftJoin(UserEntity, 'users', 'users.id = students.user_id')
      .leftJoin(CatalogueEntity, 'ethnic_origins', 'ethnic_origins.id = users.ethnic_origin_id')
    ;

    if (careerIds) {
      queryBuilder.where("enrollments.school_period_id = :schoolPeriodId and enrollments.career_id in (:...careerIds)", {
        schoolPeriodId,
        careerIds:careerIds.split(','),
      });
    } else {
      queryBuilder.where('enrollments.school_period_id = :schoolPeriodId', { schoolPeriodId });
    }

    queryBuilder
      .groupBy('states.code,states.name, users.ethnic_origin_id, ethnic_origins.code, ethnic_origins.name')
      .orderBy('ethnic_origins.name');

    return await queryBuilder.getRawMany();
  }
}
