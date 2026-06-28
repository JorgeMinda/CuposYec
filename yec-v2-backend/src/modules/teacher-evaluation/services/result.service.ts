import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ResultEntity } from '../entities/result.entity';
import { TeacherEvaluationRepositoryEnum } from '@shared/enums';
import { AutoEvaluationService } from './auto-evaluation.service';
import { ResponseEntity } from '../entities/response.entity';
import { PartnerEvaluationService } from './partner-evaluation.service';
import { StudentEvaluationService } from './student-evaluation.service';
import { CoordinatorEvaluationService } from './coordinator-evaluation.service';
import { RoleEnum } from '@auth/enums';
import { AutoEvaluationEntity } from '../entities/auto-evaluation.entity';
import { PartnerEvaluationEntity } from '../entities/partner-evaluation.entity';
import { StudentEvaluationEntity } from '../entities/student-evaluation.entity';
import { CoordinatorEvaluationEntity } from '../entities/coordinator-evaluation.entity';

@Injectable()
export class ResultService {
  constructor(
    @Inject(TeacherEvaluationRepositoryEnum.RESULT_REPOSITORY) private readonly resultRepository: Repository<ResultEntity>,
    @Inject(TeacherEvaluationRepositoryEnum.AUTO_EVALUATION_REPOSITORY) private readonly autoEvaluationRepository: Repository<AutoEvaluationEntity>,
    @Inject(TeacherEvaluationRepositoryEnum.PARTNER_EVALUATION_REPOSITORY) private readonly partnerEvaluationRepository: Repository<PartnerEvaluationEntity>,
    @Inject(TeacherEvaluationRepositoryEnum.STUDENT_EVALUATION_REPOSITORY) private readonly studentEvaluationRepository: Repository<StudentEvaluationEntity>,
    @Inject(TeacherEvaluationRepositoryEnum.COORDINATOR_EVALUATION_REPOSITORY) private readonly coordinatorEvaluationRepository: Repository<CoordinatorEvaluationEntity>,
    private readonly autoEvaluationService: AutoEvaluationService,
    private readonly partnerEvaluationService: PartnerEvaluationService,
    private readonly studentEvaluationService: StudentEvaluationService,
    private readonly coordinatorEvaluationService: CoordinatorEvaluationService,
  ) {
  }

  async createAutoEvaluationResults(autoEvaluationId: string, payload: any[]): Promise<ResultEntity[]> {
    let evaluation = await this.autoEvaluationService.findOne(autoEvaluationId);

    if (evaluation && !evaluation.enabled) {
      throw new BadRequestException('No tiene permisos para realizar le evaluación');
    }

    if (evaluation && evaluation.totalScore) {
      await this.autoEvaluationRepository.softDelete(evaluation.id);

      const { id, createdAt, updatedAt, ...rest } = evaluation;

      evaluation = await this.autoEvaluationRepository.save(rest);

      payload = payload.map((item) => {
        return {
          modelId: evaluation.id,
          questionId: item.questionId,
          responseId: item.responseId,
          score: item.score,
        };
      });
    }

    const result = this.resultRepository.create(payload);

    if (evaluation) {
      evaluation.totalScore = payload.reduce((accumulator: number, currentValue: ResponseEntity): number => {
        return accumulator + currentValue.score;
      }, 0);
    }

    evaluation.enabled = false;
    await this.autoEvaluationService.update(evaluation.id, evaluation);

    return await this.resultRepository.save(result);
  }

  async createPartnerEvaluationResults(partnerEvaluationId: string, payload: any[]): Promise<ResultEntity[]> {
    let evaluation = await this.partnerEvaluationService.findOne(partnerEvaluationId);

    if (evaluation && !evaluation.enabled) {
      throw new BadRequestException('No tiene permisos para realizar le evaluación');
    }

    if (evaluation && evaluation.totalScore) {
      await this.partnerEvaluationRepository.softDelete(evaluation.id);

      const { id, createdAt, updatedAt, ...rest } = evaluation;

      evaluation = await this.partnerEvaluationRepository.save(rest);

      payload = payload.map((item) => {
        return {
          modelId: evaluation.id,
          questionId: item.questionId,
          responseId: item.responseId,
          score: item.score,
        };
      });
    }

    const result = this.resultRepository.create(payload);

    if (evaluation) {
      evaluation.totalScore = payload.reduce((accumulator: number, currentValue: ResponseEntity): number => {
        return accumulator + currentValue.score;
      }, 0);
    }

    evaluation.enabled = false;
    await this.partnerEvaluationService.update(evaluation.id, evaluation);

    return await this.resultRepository.save(result);
  }

  async createStudentEvaluationResults(studentEvaluationId: string, payload: any[]): Promise<ResultEntity[]> {
    let evaluation = await this.studentEvaluationService.findOne(studentEvaluationId);

    if (evaluation && !evaluation.enabled) {
      throw new BadRequestException('No tiene permisos para realizar le evaluación');
    }

    if (evaluation && evaluation.totalScore) {
      await this.studentEvaluationRepository.softDelete(evaluation.id);

      const { id, createdAt, updatedAt, ...rest } = evaluation;

      evaluation = await this.studentEvaluationRepository.save(rest);

      payload = payload.map((item) => {
        return {
          modelId: evaluation.id,
          questionId: item.questionId,
          responseId: item.responseId,
          score: item.score,
        };
      });
    }

    const result = this.resultRepository.create(payload);

    if (evaluation) {
      evaluation.totalScore = payload.reduce((accumulator: number, currentValue: ResponseEntity): number => {
        return accumulator + currentValue.score;
      }, 0);
    }

    evaluation.enabled = false;
    await this.studentEvaluationService.update(evaluation.id, evaluation);

    return await this.resultRepository.save(result);
  }

  async createCoordinatorEvaluationResults(coordinatorEvaluationId: string, payload: any[]): Promise<ResultEntity[]> {
    let evaluation = await this.coordinatorEvaluationService.findOne(coordinatorEvaluationId);

    if (evaluation && !evaluation.enabled) {
      throw new BadRequestException('No tiene permisos para realizar le evaluación');
    }

    if (evaluation && evaluation.totalScore) {
      await this.coordinatorEvaluationRepository.softDelete(evaluation.id);

      const { id, createdAt, updatedAt, ...rest } = evaluation;

      evaluation = await this.coordinatorEvaluationRepository.save(rest);

      payload = payload.map((item) => {
        return {
          modelId: evaluation.id,
          questionId: item.questionId,
          responseId: item.responseId,
          score: item.score,
        };
      });
    }

    const result = this.resultRepository.create(payload);

    if (evaluation) {
      evaluation.totalScore = payload.reduce((accumulator: number, currentValue: ResponseEntity): number => {
        return accumulator + currentValue.score;
      }, 0);
    }

    evaluation.enabled = false;
    await this.coordinatorEvaluationService.update(evaluation.id, evaluation);

    return await this.resultRepository.save(result);
  }

  async findIntegralEvaluation(evaluatedId: string, schoolPeriodId: string): Promise<any> {
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

    const autoEvaluationScore = autoEvaluation?.totalScore ? parseFloat((autoEvaluation?.totalScore / 14).toFixed(2)) : null;
    const studentEvaluationScore = studentEvaluation?.totalScore ? parseFloat((studentEvaluation?.totalScore * (4 / 11)).toFixed(2)) : null;
    const partnerEvaluationScore = partnerEvaluation?.totalScore ? parseFloat((partnerEvaluation?.totalScore * (5 / 28)).toFixed(2)) : null;
    const coordinatorEvaluationScore = coordinatorEvaluation?.totalScore ? parseFloat((coordinatorEvaluation?.totalScore * (5 / 23)).toFixed(2)) : null;

    let totalScore = null;
    let quality = null;

    if (autoEvaluation?.totalScore && studentEvaluation?.totalScore && partnerEvaluation?.totalScore && coordinatorEvaluation?.totalScore) {
      totalScore = autoEvaluationScore + partnerEvaluationScore + coordinatorEvaluationScore + studentEvaluationScore;
      totalScore = totalScore.toFixed(2);

      if (totalScore >= 20 && totalScore < 40) {
        quality = 'Insatisfactorio';
      }

      if (totalScore >= 40 && totalScore < 70) {
        quality = 'Básico';
      }

      if (totalScore >= 70 && totalScore < 80) {
        quality = 'Competente';
      }

      if (totalScore >= 80 && totalScore < 95) {
        quality = 'Destacado';
      }

      if (totalScore >= 95 && totalScore < 100) {
        quality = 'Excelente';
      }
    }

    return {
      autoEvaluationScore,
      partnerEvaluationScore,
      coordinatorEvaluationScore,
      studentEvaluationScore,
      totalScore,
      quality,
    };
  }
}
