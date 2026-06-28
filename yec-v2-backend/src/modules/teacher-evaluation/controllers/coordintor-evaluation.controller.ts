import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe, Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { PartnerEvaluationService } from '../services/partner-evaluation.service';
import { CoordinatorEvaluationService } from '../services/coordinator-evaluation.service';

@ApiTags('Questions')
@Controller('teacher-evaluations/coordinator-evaluations')
export class CoordinatorEvaluationController {
  constructor(private readonly coordinatorEvaluationService: CoordinatorEvaluationService) {
  }

  @ApiOperation({ summary: 'findCoordinatorEvaluationByEvaluator' })
  @Get('evaluators/:evaluatorId')
  @HttpCode(HttpStatus.OK)
  async findCoordinatorEvaluationByEvaluator(
    @Param('evaluatorId', ParseUUIDPipe) evaluatorId: string,
    @Query('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.coordinatorEvaluationService.findCoordinatorEvaluationsByEvaluator(evaluatorId, schoolPeriodId);

    return {
      data: serviceResponse,
      message: 'La encuesta creada exitosamente',
      title: 'Encuesta Realizada',
    };
  }

  @ApiOperation({ summary: 'findCoordinatorEvaluationByEvaluated' })
  @Get('evaluated/:evaluatedId')
  @HttpCode(HttpStatus.OK)
  async findCoordinatorEvaluationByEvaluated(
    @Param('evaluatedId', ParseUUIDPipe) evaluatedId: string,
    @Query('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.coordinatorEvaluationService.findPartnerEvaluationByEvaluated(evaluatedId, schoolPeriodId);

    return {
      data: serviceResponse,
      message: 'La encuesta creada exitosamente',
      title: 'Encuesta Realizada',
    };
  }

  @Post('evaluations/school-periods/:schoolPeriodId')
  @HttpCode(HttpStatus.OK)
  async generateCoordinatorEvaluationsBySchoolPeriod(
    @Param('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string,
    @Body('careerId', ParseUUIDPipe) careerId: string,
    @Body('evaluatorId', ParseUUIDPipe) evaluatorId: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.coordinatorEvaluationService.generateCoordinatorEvaluations(schoolPeriodId, careerId, evaluatorId);

    return {
      data: serviceResponse,
      message: 'Evaluaciones Generadas',
      title: 'Correctamente',
    };
  }
}
