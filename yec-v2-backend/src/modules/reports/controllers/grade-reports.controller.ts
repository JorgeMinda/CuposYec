import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param, ParseUUIDPipe,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { GradeReportsService } from '../services/grade-reports.service';

@ApiTags('Grade Reports')
@Controller('reports/grades')
export class GradeReportsController {
  constructor(private gradeReportsService: GradeReportsService) {
  }

  @ApiOperation({ summary: 'Enrollments by Career' })
  @Get('teacher-distributions/:teacherDistributionId')
  @HttpCode(HttpStatus.OK)
  async generateEnrollmentsByCareer(@Res() res, @Param('teacherDistributionId', ParseUUIDPipe) teacherDistributionId: string): Promise<ResponseHttpModel> {
    const path = await this.gradeReportsService.generateGradesByTeacherDistribution(teacherDistributionId);

    return {
      data: res.sendFile(path),
      message: `Generate Enrollments By Career`,
      title: `Report`,
    };
  }

  @ApiOperation({ summary: 'Enrollments by Career' })
  @Get('teacher-distributions/:teacherDistributionId/error-report')
  @HttpCode(HttpStatus.OK)
  async downloadErrorReport(@Res() res, @Param('teacherDistributionId', ParseUUIDPipe) teacherDistributionId: string): Promise<ResponseHttpModel> {
    const path = await this.gradeReportsService.generateErrorReport(teacherDistributionId);

    return {
      data: res.sendFile(path),
      message: `Generate Enrollments By Career`,
      title: `Report`,
    };
  }

  @ApiOperation({ summary: 'Enrollments by Career' })
  @Get('teacher-distributions/:teacherDistributionId/grades-reports')
  @HttpCode(HttpStatus.OK)
  async generateGradesReportByTeacherDistribution(
    @Res() res,
    @Param('teacherDistributionId', ParseUUIDPipe) teacherDistributionId: string): Promise<ResponseHttpModel> {
    const pdfDoc = await this.gradeReportsService.generateGradesReportByTeacherDistribution(teacherDistributionId);

    res.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Evaluación Integral del Docente';
    pdfDoc.pipe(res);
    pdfDoc.end();

    return {
      data: null,
      message: `Student Card`,
      title: `Report`,
    };
  }
}
