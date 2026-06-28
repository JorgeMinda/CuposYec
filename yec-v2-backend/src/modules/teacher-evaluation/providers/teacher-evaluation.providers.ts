import {DataSource} from 'typeorm';
import {ConfigEnum, TeacherEvaluationRepositoryEnum} from '@shared/enums';
import {QuestionEntity} from '../entities/question.entity';
import {ResponseEntity} from '../entities/response.entity';
import {ResultEntity} from '../entities/result.entity';
import {StudentEvaluationEntity} from '../entities/student-evaluation.entity';
import {PartnerEvaluationEntity} from '../entities/partner-evaluation.entity';
import {AutoEvaluationEntity} from '../entities/auto-evaluation.entity';
import {CoordinatorEvaluationEntity} from '../entities/coordinator-evaluation.entity';

export const teacherEvaluationProviders = [
    {
        provide: TeacherEvaluationRepositoryEnum.AUTO_EVALUATION_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(AutoEvaluationEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
    {
        provide: TeacherEvaluationRepositoryEnum.QUESTION_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(QuestionEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
    {
        provide: TeacherEvaluationRepositoryEnum.RESPONSE_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ResponseEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
    {
        provide: TeacherEvaluationRepositoryEnum.RESULT_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(ResultEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
    {
        provide: TeacherEvaluationRepositoryEnum.STUDENT_EVALUATION_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(StudentEvaluationEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
    {
        provide: TeacherEvaluationRepositoryEnum.PARTNER_EVALUATION_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(PartnerEvaluationEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
    {
        provide: TeacherEvaluationRepositoryEnum.COORDINATOR_EVALUATION_REPOSITORY,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(CoordinatorEvaluationEntity),
        inject: [ConfigEnum.PG_DATA_SOURCE],
    },
];
