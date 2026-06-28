import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe, Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { AutoEvaluationService } from '../services/auto-evaluation.service';

@ApiTags('Questions')
@Controller('teacher-evaluations/auto-evaluations')
export class AutoEvaluationController {
  constructor(private readonly autoEvaluationService: AutoEvaluationService) {
  }

  @ApiOperation({ summary: 'findAutoEvaluationByEvaluated' })
  @Get('evaluated/:evaluatedId')
  @HttpCode(HttpStatus.OK)
  async findAutoEvaluationByEvaluated(
    @Param('evaluatedId', ParseUUIDPipe) evaluatedId: string,
    @Query('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.autoEvaluationService.findAutoEvaluationByEvaluated(evaluatedId, schoolPeriodId);

    return {
      data: serviceResponse,
      message: 'La encuesta creada exitosamente',
      title: 'Encuesta Realizada',
    };
  }
}
