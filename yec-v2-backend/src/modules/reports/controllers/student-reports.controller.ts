import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param, ParseUUIDPipe, Query,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import {Response} from 'express';
import { StudentReportsService } from '../services/student-reports.service';

@ApiTags('Student Reports')
@Controller('student-reports')
export class StudentReportsController {
  constructor(private studentReportsService: StudentReportsService) {
  }

  @ApiOperation({ summary: 'Socioeconomic Form Report' })
  @Get(':id/socioeconomic-form')
  @HttpCode(HttpStatus.OK)
  async generateSocioeconomicForm(@Res() res: Response, @Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const pdfDoc = await this.studentReportsService.generateSocioeconomicForm( id);

    pdfDoc.pipe(res);
    pdfDoc.end();

    return {
      data: null,
      message: `Socioeconomic Form Report`,
      title: `Report`,
    };
  }

  @ApiOperation({ summary: 'All Socioeconomic Form Report for School Period' })
  @Get(':schoolPeriodId/socioeconomic-form-all')
  @HttpCode(HttpStatus.OK)
  async generateSocioeconomicFormAll(@Res() res, @Param('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string): Promise<ResponseHttpModel> {
    const path = await this.studentReportsService.generateSocioeconomicFormAll(res, schoolPeriodId);

    return {
      data: res.sendFile(path),
      message: `Generate Enrollments By Career`,
      title: `Report`,
    };
  }

  @ApiOperation({ summary: 'Socioeconomic Form Report' })
  @Get(':id/student-card')
  @HttpCode(HttpStatus.OK)
  async generateStudentCard(@Res() response: Response, @Param('id', ParseUUIDPipe) id: string,
                            @Query('careerId') careerId:string,
                            @Query('schoolPeriodId') schoolPeriodId:string): Promise<ResponseHttpModel> {
    const pdfDoc=await this.studentReportsService.generateStudentCard( id,careerId,schoolPeriodId);

    response.setHeader('Content-Type', 'application/pdf');
    pdfDoc.info.Title = 'Factura';
    pdfDoc.pipe(response);
    pdfDoc.end();

    return {
      data: null,
      message: `Student Card`,
      title: `Report`,
    };
  }
}
