import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { CatalogueEntity } from '@core/entities';
import { CatalogueTypeEnum, TeacherEvaluationRepositoryEnum } from '@shared/enums';
import { join } from 'path';
import * as XLSX from 'xlsx';
import * as fs from 'fs';
import { CataloguesService } from '@core/services';
import { QuestionEntity } from '../../teacher-evaluation/entities/question.entity';
import { ResponseEntity } from '../../teacher-evaluation/entities/response.entity';

enum ColumnsEnum {
  EVALUATION_TYPE = 'evaluation_type',
  CATEGORY = 'category',
  QUESTION = 'question',
}

@Injectable()
export class TeacherEvaluationsService {
  private row = 1;
  private categories: CatalogueEntity[] = [];
  private evaluationTypes: CatalogueEntity[] = [];

  constructor(
    private readonly cataloguesService: CataloguesService,
    @Inject(TeacherEvaluationRepositoryEnum.QUESTION_REPOSITORY) private readonly questionRepository: Repository<QuestionEntity>,
    @Inject(TeacherEvaluationRepositoryEnum.RESPONSE_REPOSITORY) private readonly responseRepository: Repository<ResponseEntity>,
  ) {
  }

  async loadCatalogues() {
    const catalogues = (await this.cataloguesService.findAll()).data as CatalogueEntity[];

    this.evaluationTypes = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.QUESTIONS_EVALUATION_TYPE);
    this.categories = catalogues.filter(catalogue => catalogue.type === CatalogueTypeEnum.QUESTIONS_CATEGORY);
  }

  async import(file: Express.Multer.File) {
    try {
      const path = join(process.cwd(), 'storage/imports', file.filename);
      const workbook = XLSX.readFile(path);

      await this.loadCatalogues();
      // const sheetNames = ['auto', 'student', 'partner', 'coordinator'];
      const sheetNames = ['partner'];

      for (let i = 0; i < 4; i++) {
        const dataExcel = XLSX.utils.sheet_to_json(workbook.Sheets[sheetNames[i]]);

        this.row = 1;

        for (const item of dataExcel) {
          const evaluationType = this.evaluationTypes.find(evaluationType => evaluationType.code.toLowerCase() === item[ColumnsEnum.EVALUATION_TYPE]);
          const category = this.categories.find(category => category.name.toLowerCase() === item[ColumnsEnum.CATEGORY].toString().toLowerCase().trim());

          const newQuestion = this.questionRepository.create();
          newQuestion.code = this.row.toString();
          newQuestion.description = item[ColumnsEnum.QUESTION];
          newQuestion.name = item[ColumnsEnum.QUESTION];
          newQuestion.categoryId = category.id;
          newQuestion.evaluationTypeId = evaluationType.id;
          newQuestion.sort = this.row;

          const questionCreated = await this.questionRepository.save(newQuestion);

          const responses = [];

          for (let i = 1; i <= 5; i++) {
            const newResponse = this.responseRepository.create();
            newResponse.questionId = questionCreated.id;
            newResponse.code = i.toString();
            newResponse.description = i.toString();
            newResponse.name = i.toString();
            newResponse.score = i;
            newResponse.sort = i;

            responses.push(newResponse);
          }

          await this.responseRepository.save(responses);

          this.row++;
        }
      }
      fs.unlinkSync(join(process.cwd(), 'storage/imports', file.filename));
    } catch (err) {
      throw new BadRequestException('Problemas al subir el archivo, por favor verifique los errores');
    }
  }
}
