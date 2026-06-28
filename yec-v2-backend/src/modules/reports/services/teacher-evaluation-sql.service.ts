import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { SchoolPeriodEntity } from '@core/entities';
import { AuthRepositoryEnum, CoreRepositoryEnum, TeacherEvaluationRepositoryEnum } from '@shared/enums';
import { UserEntity } from '@auth/entities';
import { CataloguesService } from '@core/services';
import { AutoEvaluationEntity } from '../../teacher-evaluation/entities/auto-evaluation.entity';
import { CoordinatorEvaluationEntity } from '../../teacher-evaluation/entities/coordinator-evaluation.entity';
import { StudentEvaluationEntity } from '../../teacher-evaluation/entities/student-evaluation.entity';
import { PartnerEvaluationEntity } from '../../teacher-evaluation/entities/partner-evaluation.entity';
import { RoleEnum } from '@auth/enums';

@Injectable()
export class TeacherEvaluationSqlService {
  constructor(
    @Inject(AuthRepositoryEnum.USER_REPOSITORY) private readonly userRepository: Repository<UserEntity>,
    @Inject(CoreRepositoryEnum.SCHOOL_PERIOD_REPOSITORY) private readonly schoolPeriodRepository: Repository<SchoolPeriodEntity>,
    @Inject(TeacherEvaluationRepositoryEnum.AUTO_EVALUATION_REPOSITORY) private readonly autoEvaluationRepository: Repository<AutoEvaluationEntity>,
    @Inject(TeacherEvaluationRepositoryEnum.PARTNER_EVALUATION_REPOSITORY) private readonly partnerEvaluationRepository: Repository<PartnerEvaluationEntity>,
    @Inject(TeacherEvaluationRepositoryEnum.STUDENT_EVALUATION_REPOSITORY) private readonly studentEvaluationRepository: Repository<StudentEvaluationEntity>,
    @Inject(TeacherEvaluationRepositoryEnum.COORDINATOR_EVALUATION_REPOSITORY) private readonly coordinatorEvaluationRepository: Repository<CoordinatorEvaluationEntity>,
    private readonly cataloguesService: CataloguesService,
  ) {
  }

  async findIntegralEvaluation(evaluatedId: string, schoolPeriodId: string): Promise<any> {
    const evaluated = await this.userRepository.findOne({
      relations: { teacher: { careerToTeachers: { career: true } } },
      where: { id: evaluatedId, teacher: { careerToTeachers: { isCurrent: true } } },
    });

    const viceRector = await this.userRepository.findOne({
      where: { roles: { code: RoleEnum.VICE_RECTOR } },
    });

    const schoolPeriod = await this.schoolPeriodRepository.findOne({
      where: { id: schoolPeriodId },
    });

    const autoEvaluation = await this.autoEvaluationRepository.findOne({
      where: { evaluatedId, schoolPeriodId },
    });

    const partnerEvaluation = await this.partnerEvaluationRepository.findOne({
      where: { evaluatedId, schoolPeriodId },
    });

    const coordinatorEvaluation = await this.coordinatorEvaluationRepository.findOne({
      where: { evaluatedId, schoolPeriodId },
    });

    const studentEvaluation = await this.studentEvaluationRepository.createQueryBuilder('student_evaluations')
      .select('AVG(student_evaluations.total_score)', 'totalScore')
      .where('evaluated_id = :evaluatedId and school_period_id = :schoolPeriodId and student_evaluations.total_score is not null',
        { evaluatedId, schoolPeriodId })
      .getRawOne();

    const autoEvaluationScore = autoEvaluation.totalScore ? (autoEvaluation?.totalScore / 14).toFixed(2) : 'Pendiente';
    const studentEvaluationScore = studentEvaluation.totalScore ? (studentEvaluation?.totalScore * (4 / 11)).toFixed(2) : 'Pendiente';
    const partnerEvaluationScore = partnerEvaluation.totalScore ? (partnerEvaluation?.totalScore * (5 / 28)).toFixed(2) : 'Pendiente';
    const coordinatorEvaluationScore = coordinatorEvaluation.totalScore ? (coordinatorEvaluation?.totalScore * (5 / 23)).toFixed(2) : 'Pendiente';

    let totalScore = 'Pendiente';
    let quality = 'Pendiente';

    if (autoEvaluation.totalScore && studentEvaluation.totalScore && partnerEvaluation.totalScore && coordinatorEvaluation.totalScore) {
      const total = parseFloat(autoEvaluationScore) + parseFloat(partnerEvaluationScore) + parseFloat(coordinatorEvaluationScore) + parseFloat(studentEvaluationScore);
      totalScore = total.toFixed(2);

      if (total >= 20 && total < 40) {
        quality = 'Insatisfactorio';
      }

      if (total >= 40 && total < 70) {
        quality = 'Básico';
      }

      if (total >= 70 && total < 80) {
        quality = 'Competente';
      }

      if (total >= 80 && total < 95) {
        quality = 'Destacado';
      }

      if (total >= 95 && total < 100) {
        quality = 'Excelente';
      }
    }

    return {
      evaluated,
      viceRector,
      schoolPeriod,
      autoEvaluationScore,
      partnerEvaluationScore,
      coordinatorEvaluationScore,
      studentEvaluationScore,
      totalScore,
      quality,
    };
  }
}
