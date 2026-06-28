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

@Injectable()
export class PartnerEvaluationService {
  constructor(
    @Inject(TeacherEvaluationRepositoryEnum.PARTNER_EVALUATION_REPOSITORY) private readonly repository: Repository<PartnerEvaluationEntity>,
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

  async findPartnerEvaluationsByEvaluator(evaluatorId: string, schoolPeriodId: string): Promise<PartnerEvaluationEntity[]> {
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

  async generatePartnerEvaluations(schoolPeriodId: string): Promise<PartnerEvaluationEntity[]> {
    const evaluationTypes = await this.catalogueService.findByType(CatalogueTypeEnum.QUESTIONS_EVALUATION_TYPE);

    const evaluationType = evaluationTypes.find(evaluationType => evaluationType.code === 'partner');

    const careers = await this.findCareersWithTeachers();

    const partnerEvaluations = [];

    for (const career of careers) {
      for (const careerToTeacher of career.careerToTeachers) {
        let index = Math.floor(Math.random() * (career.careerToTeachers.length));
        let evaluatedId = career.careerToTeachers[index].teacher.userId;

        let i = career.careerToTeachers.length;
        while (evaluatedId === careerToTeacher.teacher.userId) {
          index = Math.floor(Math.random() * (career.careerToTeachers.length));
          // console.log('evaluatedId', evaluatedId);
          // console.log('evaluatorId', careerToTeacher.teacher.userId);
          evaluatedId = career.careerToTeachers[index].teacher.userId;
          i--;
          if (i === 0) {
            break;
          }
        }

        let partnerEvaluation = await this.repository.findOne({
          where: {
            schoolPeriodId,
            evaluatedId,
          },
        });

        if (!partnerEvaluation) {
          partnerEvaluation = this.repository.create();
        }

        partnerEvaluation.evaluatorId = careerToTeacher.teacher.userId;
        partnerEvaluation.schoolPeriodId = schoolPeriodId;
        partnerEvaluation.evaluationTypeId = evaluationType.id;

        partnerEvaluation.evaluatedId = evaluatedId;

        // evaluates.splice(index, 1);

        partnerEvaluations.push(partnerEvaluation);
      }

      // console.log('------------------');
    }

    await this.repository.save(partnerEvaluations);

    return await this.repository.find({ relations: { evaluated: true, evaluator: true } });
  }

  private async findCareersWithTeachers(): Promise<CareerEntity[]> {
    return await this.careerRepository.find({
      relations: { careerToTeachers: { teacher: true } },
      where: { careerToTeachers: { isCurrent: true } },
    });
  }
}