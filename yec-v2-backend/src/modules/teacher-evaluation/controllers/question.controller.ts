import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QuestionService } from '../services/question.service';
import { CreateQuestionDto } from '../dto/question/create-question.dto';
import { UpdateQuestionDto } from '../dto/question/update-question.dto';
import { FilterQuestionDto } from '../dto/question/filter-question.dto';
import { ResponseHttpModel } from '@shared/models';

@ApiTags('Questions')
@Controller('teacher-evaluations/questions')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createQuestionDto: CreateQuestionDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.questionService.create(createQuestionDto);
    return {
      data: serviceResponse.data,
      message: 'Pregunta creada exitosamente',
      title: 'Pregunta Creada',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: FilterQuestionDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.questionService.findAll(params);
    return {
      data: serviceResponse.data,
      message: 'Preguntas obtenidas exitosamente',
      title: 'Preguntas',
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.questionService.findOne(id);
    return {
      data: serviceResponse.data,
      message: `Pregunta con ID ${id} obtenida exitosamente`,
      title: 'Pregunta',
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateQuestionDto: UpdateQuestionDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.questionService.update(id, updateQuestionDto);
    return {
      data: serviceResponse.data,
      message: `Pregunta con ID ${id} actualizada exitosamente`,
      title: 'Pregunta Actualizada',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    await this.questionService.remove(id);
    return {
      data: null,
      message: `Pregunta con ID ${id} eliminada exitosamente`,
      title: 'Pregunta Eliminada',
    };
  }

  @Get('evaluation-types/:evaluationTypeId')
  @HttpCode(HttpStatus.OK)
  async findQuestionsByEvaluationType(@Param('evaluationTypeId', ParseUUIDPipe) evaluationTypeId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.questionService.findQuestionsByEvaluationType(evaluationTypeId);

    return {
      data: serviceResponse,
      message: ``,
      title: 'Pregunta',
    };
  }
}
