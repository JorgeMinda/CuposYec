import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TeacherEvaluationRepositoryEnum } from '@shared/enums';
import { AutoEvaluationEntity } from '../entities/auto-evaluation.entity';
import { ResultEntity } from '../entities/result.entity';

@Injectable()
export class AutoEvaluationService {
  constructor(
    @Inject(TeacherEvaluationRepositoryEnum.AUTO_EVALUATION_REPOSITORY) private readonly repository: Repository<AutoEvaluationEntity>,
    @Inject(TeacherEvaluationRepositoryEnum.RESULT_REPOSITORY) private readonly resultRepository: Repository<ResultEntity>,
  ) {
  }

  async create(evaluatedId: string, payload: any): Promise<ResultEntity[]> {
    const evaluation = await this.repository.findOneBy({ evaluatedId });

    if (evaluation && !evaluation.enabled) {
      throw new BadRequestException('No tiene permisos para realizar le evaluación');
    }

    if (evaluation && evaluation.totalScore) {
      throw new BadRequestException('Evaluation already exists');
    }

    const newResult = this.resultRepository.create(payload);

    return await this.resultRepository.save(newResult);
  }

  async update(id: string, payload: any): Promise<AutoEvaluationEntity[]> {
    const autoEvaluation = await this.repository.findOneBy({ id });

    if (!autoEvaluation) {
      throw new NotFoundException('Autoevaluación no encontrada');
    }

    return this.repository.save(payload);
  }

  async findAutoEvaluationByEvaluated(evaluatedId: string, schoolPeriodId: string): Promise<AutoEvaluationEntity> {
    return await this.repository.findOne(
      {
        relations: { evaluated: true, evaluationType: true },
        where: { evaluatedId, schoolPeriodId },
      });
  }

  async findOne(id: string): Promise<AutoEvaluationEntity> {
    return await this.repository.findOne(
      {
        relations: { evaluated: true, evaluationType: true },
        where: { id },
      });
  }
}
