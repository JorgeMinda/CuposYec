import {
  Body,
  Controller,
  Delete, Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateTeacherDistributionDto, UpdateTeacherDistributionDto, FilterTeacherDistributionDto } from '@core/dto';
import { EnrollmentDetailsService, TeacherDistributionsService } from '@core/services';
import { TeacherDistributionEntity } from '@core/entities';
import { ResponseHttpModel } from '@shared/models';
import { PublicRoute } from '@auth/decorators';

@PublicRoute()
@ApiTags('Teacher Distribution')
@Controller('teacher-distributions')
export class TeacherDistributionsController {
  constructor(private teacherDistributionsService: TeacherDistributionsService,private enrollmentDetailsService:EnrollmentDetailsService) {
  }

  @PublicRoute()
  @ApiOperation({ summary: 'Catalogue' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherDistributionsService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catálogo`,
      title: `Catálogo`,
    };
  }
@PublicRoute()
  @ApiOperation({ summary: 'Create' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateTeacherDistributionDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherDistributionsService.create(payload);

    return {
      data: serviceResponse,
      message: 'fue creada',
      title: 'creada',
    };
  }
@PublicRoute()
  @ApiOperation({ summary: 'Find All' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: FilterTeacherDistributionDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherDistributionsService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Buscar todas las ',
      title: 'Success',
    };
  }
@PublicRoute()
  @ApiOperation({ summary: 'Find One' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherDistributionsService.findOne(id);

    return {
      data: serviceResponse,
      message: `Buscar`,
      title: `Success`,
    };
  }
@PublicRoute()
  @ApiOperation({ summary: 'Update' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateTeacherDistributionDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherDistributionsService.update(id, payload);
    return {
      data: serviceResponse,
      message: `fue actualizada`,
      title: `actualizada`,
    };
  }
@PublicRoute()
  @ApiOperation({ summary: 'Delete' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherDistributionsService.remove(id);
    return {
      data: serviceResponse,
      message: `fue eliminada`,
      title: `eliminada`,
    };
  }
@PublicRoute()
  @ApiOperation({ summary: 'Delete All' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: TeacherDistributionEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherDistributionsService.removeAll(payload);

    return {
      data: serviceResponse,
      message: `fueron eliminadas`,
      title: `eliminadas`,
    };
  }
@PublicRoute()
  @ApiOperation({ summary: 'Exportar distributivo' })
  @Get('teacher-distributions')
  @HttpCode(HttpStatus.CREATED)
  async exportTeacherDistributions(@Res() res): Promise<ResponseHttpModel> {
    const path = await this.teacherDistributionsService.exportTeacherDistributions();

    return {
      data: res.sendFile(path),
      message: `Distributivo Docente Exportado`,
      title: `Exportado`,
    };
  }
@PublicRoute()
  @ApiOperation({ summary: 'Find TeacherDistributions By Teacher' })
  @Get('teachers/:teacherId')
  @HttpCode(HttpStatus.OK)
  async findTeacherDistributionsByTeacher(@Param('teacherId', ParseUUIDPipe) teacherId: string,
                                          @Query('schoolPeriodId') schoolPeriodId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherDistributionsService.findTeacherDistributionsByTeacher(teacherId, schoolPeriodId);

    return {
      data: serviceResponse,
      message: `Success`,
      title: `Success`,
    };
  }
@PublicRoute()
  @ApiOperation({ summary: 'Find TeacherDistributions By Teacher' })
  @Get(':id/:enrollment-details')
  @HttpCode(HttpStatus.OK)
  async findEnrollmentDetailsByTeacherDistribution(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.enrollmentDetailsService.findEnrollmentDetailsByTeacherDistribution(id);

    return {
      data: serviceResponse,
      message: `Success`,
      title: `Success`,
    };
  }
}