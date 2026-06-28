import {
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

@ApiTags('Questions')
@Controller('teacher-evaluations/partner-evaluations')
export class PartnerEvaluationController {
  constructor(private readonly partnerEvaluationService: PartnerEvaluationService) {
  }

  @ApiOperation({ summary: 'findPartnerEvaluationsByEvaluator' })
  @Get('evaluators/:evaluatorId')
  @HttpCode(HttpStatus.OK)
  async findPartnerEvaluationsByEvaluator(
    @Param('evaluatorId', ParseUUIDPipe) evaluatorId: string,
    @Query('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.partnerEvaluationService.findPartnerEvaluationsByEvaluator(evaluatorId, schoolPeriodId);

    return {
      data: serviceResponse,
      message: 'La encuesta creada exitosamente',
      title: 'Encuesta Realizada',
    };
  }

  @ApiOperation({ summary: 'findPartnerEvaluationByEvaluated' })
  @Get('evaluated/:evaluatedId')
  @HttpCode(HttpStatus.OK)
  async findPartnerEvaluationByEvaluated(
    @Param('evaluatedId', ParseUUIDPipe) evaluatedId: string,
    @Query('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string,
  ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.partnerEvaluationService.findPartnerEvaluationByEvaluated(evaluatedId, schoolPeriodId);

    return {
      data: serviceResponse,
      message: 'La encuesta creada exitosamente',
      title: 'Encuesta Realizada',
    };
  }

  @Post('evaluations/school-periods/:schoolPeriodId')
  @HttpCode(HttpStatus.OK)
  async generatePartnerEvaluationsBySchoolPeriod(@Param('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.partnerEvaluationService.generatePartnerEvaluations(schoolPeriodId);

    return {
      data: serviceResponse,
      message: 'Evaluaciones Generadas',
      title: 'Correctamente',
    };
  }
}
