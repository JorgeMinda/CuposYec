import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { UpdateQuestionDto } from '../dto/question/update-question.dto';
import { FilterQuestionDto } from '../dto/question/filter-question.dto';
import { QuestionEntity } from '../entities/question.entity';
import { TeacherEvaluationRepositoryEnum } from '@shared/enums';
import { ServiceResponseHttpModel } from '@shared/models';

@Injectable()
export class QuestionService {
  constructor(
    @Inject(TeacherEvaluationRepositoryEnum.QUESTION_REPOSITORY)
    private readonly repository: Repository<QuestionEntity>,
  ) {
  }

  async create(payload: CreateQuestionDto): Promise<ServiceResponseHttpModel> {
    const newQuestion = this.repository.create(payload);
    const question = await this.repository.save(newQuestion);
    return { data: question };
  }

  async findAll(params?: FilterQuestionDto): Promise<ServiceResponseHttpModel> {
    const questions = await this.repository.find();
    return { data: questions };
  }

  async findOne(id: string): Promise<ServiceResponseHttpModel> {
    const question = await this.repository.findOneBy({ id });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    return { data: question };
  }

  async update(id: string, payload: UpdateQuestionDto): Promise<ServiceResponseHttpModel> {
    const question = await this.repository.findOneBy({ id });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    this.repository.merge(question, payload);
    const updatedQuestion = await this.repository.save(question);

    return { data: updatedQuestion };
  }

  async remove(id: string): Promise<void> {
    const question = await this.repository.findOneBy({ id });

    if (!question) {
      throw new NotFoundException('Question not found');
    }

    await this.repository.softRemove(question);
  }

  async findQuestionsByEvaluationType(evaluationTypeId: string): Promise<QuestionEntity[]> {
    return await this.repository.find({
      relations: { responses: true, category: true },
      where: { evaluationTypeId },
      order: { sort: 'asc', responses: { sort: 'asc' } },
    });
  }
}
