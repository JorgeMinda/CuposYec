import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param, ParseUUIDPipe, Query,
    Res,
} from '@nestjs/common';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {ResponseHttpModel} from '@shared/models';
import {Response} from 'express';
import {TeacherEvaluationReportsService} from "../services/teacher-evaluation-reports.service";

@ApiTags('Student Reports')
@Controller('reports/teacher-evaluations')
export class TeacherEvaluationReportsController {
    constructor(private teacherEvaluationReportsService: TeacherEvaluationReportsService) {
    }

    @ApiOperation({summary: 'Integral Evaluation'})
    @Get('integral-evaluations/:evaluatedId/download')
    @HttpCode(HttpStatus.OK)
    async generateIntegralEvaluation(
        @Res() response: Response,
        @Param('evaluatedId', ParseUUIDPipe) evaluatedId: string,
        @Query('schoolPeriodId') schoolPeriodId: string): Promise<ResponseHttpModel> {
        const pdfDoc = await this.teacherEvaluationReportsService.generateIntegralEvaluation(evaluatedId, schoolPeriodId);

        response.setHeader('Content-Type', 'application/pdf');
        pdfDoc.info.Title = 'Evaluación Integral del Docente';
        pdfDoc.pipe(response);
        pdfDoc.end();

        return {
            data: null,
            message: `Student Card`,
            title: `Report`,
        };
    }
}
