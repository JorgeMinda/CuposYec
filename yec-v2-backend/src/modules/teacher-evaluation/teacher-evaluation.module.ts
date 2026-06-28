import {Global, Module} from '@nestjs/common';
import {CacheModule} from '@nestjs/cache-manager';
import {DatabaseModule} from '@database';
import {teacherEvaluationProviders} from './providers';
import {QuestionService} from './services/question.service';
import {QuestionController} from './controllers/question.controller';
import {ResponseService} from './services/response.service';
import {ResponseController} from './controllers/response.controller';
import {ResultController} from './controllers/result.controller';
import {ResultService} from './services/result.service';
import {StudentEvaluationController} from './controllers/student-evaluation.controller';
import {StudentEvaluationService} from './services/student-evaluation.service';
import {TeacherEvaluationsController} from '../imports/controllers/teacher-evaluations.controller';
import {TeacherEvaluationsService} from '../imports/services/teacher-evaluations.service';
import {AutoEvaluationController} from './controllers/auto-evaluation.controller';
import {AutoEvaluationService} from './services/auto-evaluation.service';
import {PartnerEvaluationController} from './controllers/partner-evaluation.controller';
import {PartnerEvaluationService} from './services/partner-evaluation.service';
import {CoordinatorEvaluationController} from './controllers/coordintor-evaluation.controller';
import {CoordinatorEvaluationService} from './services/coordinator-evaluation.service';
import {coreProviders} from "@core/providers";

@Global()
@Module({
    imports: [DatabaseModule, CacheModule.register()],
    controllers: [
        AutoEvaluationController,
        QuestionController,
        ResponseController,
        ResultController,
        StudentEvaluationController,
        TeacherEvaluationsController,
        PartnerEvaluationController,
        CoordinatorEvaluationController,
    ],
    providers: [
        ...teacherEvaluationProviders,
        AutoEvaluationService,
        QuestionService,
        ResponseService,
        ResultService,
        StudentEvaluationService,
        TeacherEvaluationsService,
        PartnerEvaluationService,
        CoordinatorEvaluationService,
    ],
    exports: [
        ...teacherEvaluationProviders,
    ]
})
export class TeacherEvaluationModule {
}
