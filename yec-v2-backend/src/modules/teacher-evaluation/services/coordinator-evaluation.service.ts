import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CatalogueTypeEnum, CoreRepositoryEnum, TeacherEvaluationRepositoryEnum } from '@shared/enums';
import { AutoEvaluationEntity } from '../entities/auto-evaluation.entity';
import { ResultEntity } from '../entities/result.entity';
import { PartnerEvaluationEntity } from '../entities/partner-evaluation.entity';
import {
  CareerEntity,
  TeacherEntity,
} from '@core/entities';
import { CataloguesService } from '@core/services';
import { CoordinatorEvaluationEntity } from '../entities/coordinator-evaluation.entity';

@Injectable()
export class CoordinatorEvaluationService {
  constructor(
    @Inject(TeacherEvaluationRepositoryEnum.COORDINATOR_EVALUATION_REPOSITORY) private readonly repository: Repository<CoordinatorEvaluationEntity>,
    @Inject(TeacherEvaluationRepositoryEnum.RESULT_REPOSITORY) private readonly resultRepository: Repository<ResultEntity>,
    @Inject(CoreRepositoryEnum.TEACHER_REPOSITORY) private readonly teacherRepository: Repository<TeacherEntity>,
    @Inject(CoreRepositoryEnum.CAREER_REPOSITORY) private readonly careerRepository: Repository<CareerEntity>,
    private readonly catalogueService: CataloguesService,
  ) {
  }

  async update(id: string, payload: any): Promise<AutoEvaluationEntity[]> {
    const evaluation = await this.repository.findOneBy({ id });

    if (!evaluation) {
      throw new NotFoundException('Evaluación por pares no encontrada');
    }

    return this.repository.save(payload);
  }

  async findCoordinatorEvaluationsByEvaluator(evaluatorId: string, schoolPeriodId: string): Promise<PartnerEvaluationEntity[]> {
    return await this.repository.find(
      {
        relations: { evaluated: true, evaluator: true, evaluationType: true },
        where: { evaluatorId, schoolPeriodId },
      });
  }

  async findPartnerEvaluationByEvaluated(evaluatedId: string, schoolPeriodId: string): Promise<PartnerEvaluationEntity> {
    return await this.repository.findOne(
      {
        relations: { evaluated: true, evaluator: true, evaluationType: true },
        where: { evaluatedId, schoolPeriodId },
      });
  }

  async findOne(id: string): Promise<PartnerEvaluationEntity> {
    return await this.repository.findOne(
      {
        relations: { evaluated: true, evaluator: true, evaluationType: true },
        where: { id },
      });
  }

  async generateCoordinatorEvaluations(schoolPeriodId: string, careerId: string,evaluatorId:string): Promise<CoordinatorEvaluationEntity[]> {
    const evaluationTypes = await this.catalogueService.findByType(CatalogueTypeEnum.QUESTIONS_EVALUATION_TYPE);

    const evaluationType = evaluationTypes.find(evaluationType => evaluationType.code === 'coordinator');

    const careers = await this.findCareersWithTeachers(careerId);

    const coordinatorEvaluations = [];

    for (const career of careers) {
      for (const careerToTeacher of career.careerToTeachers) {
        let coordinatorEvaluation = await this.repository.findOne({
          where: {
            schoolPeriodId,
            evaluatedId: careerToTeacher.teacher.userId,
          },
        });

        if (!coordinatorEvaluation) {
          coordinatorEvaluation = this.repository.create();
        }

        coordinatorEvaluation.evaluatorId = evaluatorId;
        coordinatorEvaluation.evaluatedId = careerToTeacher.teacher.userId;
        coordinatorEvaluation.schoolPeriodId = schoolPeriodId;
        coordinatorEvaluation.evaluationTypeId = evaluationType.id;

        coordinatorEvaluations.push(coordinatorEvaluation);
      }
    }

    return await this.repository.save(coordinatorEvaluations);
  }

  private async findCareersWithTeachers(id: string): Promise<CareerEntity[]> {
    return await this.careerRepository.find({
      relations: { careerToTeachers: { teacher: true } },
      where: { id, careerToTeachers: { isCurrent: true } },
    });
  }
}