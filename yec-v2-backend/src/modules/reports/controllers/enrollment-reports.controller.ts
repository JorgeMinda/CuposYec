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
import { EnrollmentReportsService } from '../services/enrollment-reports.service';

@ApiTags('Enrollment Reports')
@Controller('enrollment-reports')
export class EnrollmentReportsController {
  constructor(private enrollmentReportsService: EnrollmentReportsService) {
  }

  @ApiOperation({ summary: 'Enrollment Certificate Report' })
  @Get(':id/certificate')
  @HttpCode(HttpStatus.OK)
  async generateEnrollmentCertificate(@Res() res: Response, @Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    await this.enrollmentReportsService.generateEnrollmentCertificate(res, id);

    return {
      data: null,
      message: `Enrollment Certificate`,
      title: `Report`,
    };
  }

  @ApiOperation({ summary: 'Enrollment Application Report' })
  @Get(':id/application')
  @HttpCode(HttpStatus.OK)
  async generateEnrollmentApplication(@Res() res: Response, @Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    await this.enrollmentReportsService.generateEnrollmentApplication(res, id);

    return {
      data: null,
      message: `Enrollment Certificate`,
      title: `Report`,
    };
  }

  @ApiOperation({ summary: 'Enrollments by Career' })
  @Get('careers/:careerId')
  @HttpCode(HttpStatus.OK)
  async generateEnrollmentsByCareer(@Res() res, @Param('careerId', ParseUUIDPipe) careerId: string, @Query('schoolPeriodId') schoolPeriodId: string): Promise<ResponseHttpModel> {
    const path = await this.enrollmentReportsService.generateEnrollmentsByCareer(careerId, schoolPeriodId);

    return {
      data: res.sendFile(path),
      message: `Generate Enrollments By Career`,
      title: `Report`,
    };
  }

  @ApiOperation({ summary: 'Academic Record' })
  @Get('academic-records/:studentId')
  @HttpCode(HttpStatus.OK)
  async generateAcademicRecordByStudent(@Res() res, @Param('studentId', ParseUUIDPipe) studentId: string, @Query('careerId') careerId: string): Promise<ResponseHttpModel> {
    await this.enrollmentReportsService.generateAcademicRecordByStudent(res,studentId,careerId);

    return {
      data: null,
      message: `Generate Enrollments By Career`,
      title: `Report`,
    };
  }

  @ApiOperation({ summary: 'Enrollments by School Periods' })
  @Get('school-periods/:schoolPeriodId')
  @HttpCode(HttpStatus.OK)
  async generateEnrollments(@Res() res, @Param('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string): Promise<ResponseHttpModel> {
    const path = await this.enrollmentReportsService.generateEnrollmentsBySchoolPeriod(schoolPeriodId);

    return {
      data: res.sendFile(path),
      message: `Generate Enrollments By School Period`,
      title: `Report`,
    };
  }

  @ApiOperation({ summary: 'Enrollment Details by School Period' })
  @Get('enrollment-details/:schoolPeriodId')
  @HttpCode(HttpStatus.OK)
  async generateEnrollmentDetailsBySchoolPeriod(@Res() res, @Param('schoolPeriodId', ParseUUIDPipe) schoolPeriodId: string): Promise<ResponseHttpModel> {
    const path = await this.enrollmentReportsService.generateEnrollmentDetailsBySchoolPeriod(schoolPeriodId);

    return {
      data: res.sendFile(path),
      message: `Generate Enrollments By School Period`,
      title: `Report`,
    };
  }
}
