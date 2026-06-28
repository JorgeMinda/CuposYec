import {
  Controller,
  Get,
  HttpCode,
  HttpStatus, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { DashboardsService } from '../services/dashboards.service';

@ApiTags('Dashboards')
@Controller('dashboards')
export class DashboardsController {
  constructor(private dashboardsService: DashboardsService) {
  }

  @ApiOperation({ summary: 'Enrolled Students' })
  @Get('enrolled-students')
  @HttpCode(HttpStatus.OK)
  async findEnrolledStudents(@Query('careerIds') careerIds: string,@Query('schoolPeriodId') schoolPeriodId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.dashboardsService.findEnrolledStudents(careerIds,schoolPeriodId);

    return {
      data: serviceResponse,
      message: `Enrolled Students`,
      title: `Enrolled`,
    };
  }

  @ApiOperation({ summary: 'Enrolled Students' })
  @Get('enrolled-students/sexes')
  @HttpCode(HttpStatus.OK)
  async findEnrolledStudentsForSex(@Query('careerIds') careerIds: string,@Query('schoolPeriodId') schoolPeriodId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.dashboardsService.findEnrolledStudentsForSex(careerIds,schoolPeriodId);

    return {
      data: serviceResponse,
      message: `Enrolled Students`,
      title: `Enrolled`,
    };
  }

  @ApiOperation({ summary: 'Enrolled Students' })
  @Get('enrolled-students/ethnic-origins')
  @HttpCode(HttpStatus.OK)
  async findEnrolledStudentsForEthnicOrigin(@Query('careerIds') careerIds: string,@Query('schoolPeriodId') schoolPeriodId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.dashboardsService.findEnrolledStudentsForEthnicOrigin(careerIds,schoolPeriodId);

    return {
      data: serviceResponse,
      message: `Enrolled Students`,
      title: `Enrolled`,
    };
  }
}
