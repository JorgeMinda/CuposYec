import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe, Post, Query,
} from '@nestjs/common';
import { ResponseHttpModel } from '@shared/models';
import { StudentEvaluationService } from '../services/student-evaluation.service';

@Controller('teacher-evaluations/student-evaluations')
export class StudentEvaluationController {
  constructor(private readonly studentResultService: StudentEvaluationService) {
  }

  @Get('evaluators/:evaluatorId')
  @HttpCode(HttpStatus.OK)
  async findStudentEvaluationsByEvaluator(
    @Param('evaluatorId', ParseUUIDPipe) evaluatorId: string,
    @Query('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentResultService.findStudentEvaluationsByEvaluator(evaluatorId, schoolPeriodId);

    return {
      data: serviceResponse,
      message: 'La encuesta creada exitosamente',
      title: 'Encuesta Realizada',
    };
  }

  @Post('school-periods/:schoolPeriodId')
  @HttpCode(HttpStatus.OK)
  async generateStudentEvaluationsBySchoolPeriod(@Param('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentResultService.generateStudentEvaluations(schoolPeriodId);

    return {
      data: serviceResponse,
      message: 'Evaluaciones de estudiantes',
      title: 'Creadas correctamente',
    };
  }
}
