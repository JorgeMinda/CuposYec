import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseHttpModel } from '@shared/models';
import { EnrollmentsService, TeacherDistributionsService } from '@core/services';
import { CreateTeacherDto, FilterTeacherDto, UpdateTeacherDto } from '@core/dto';
import { TeacherEntity } from '@core/entities';
import { TeachersService } from '../services/teachers.service';

@ApiTags('Teachers')
@Controller('teachers')
export class TeachersController {
  constructor(private readonly teachersService: TeachersService,
              private readonly teacherDistributionsService: TeacherDistributionsService,
              private readonly enrollmentsService: EnrollmentsService) {
  }

  @ApiOperation({ summary: 'Lista de todos los usuarios' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teachersService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogo`,
      title: `Catalogo`,
    };
  }

  @ApiOperation({ summary: 'Lista de usuarios' })
  // @Roles(RoleEnum.ADMIN)
  @Get('all')
  @HttpCode(HttpStatus.OK)
  async findAll(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teachersService.findAll();

    return {
      data: serviceResponse,
      message: `index`,
      title: `index`,
    };
  }

  @ApiOperation({ summary: 'Lista de usuarios' })
  // @Roles(RoleEnum.ADMIN)
  @Get('')
  @HttpCode(HttpStatus.OK)
  async findTeachers(@Query() params: FilterTeacherDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teachersService.findTeachers(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `index`,
      title: `index`,
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teachersService.findOne(id);
    return {
      data: serviceResponse,
      message: `show ${id}`,
      title: `Success`,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateTeacherDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teachersService.update(id, payload);

    return {
      data: serviceResponse,
      message: `Usuario actualizado ${id}`,
      title: `Actualizado`,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teachersService.remove(id);

    return {
      data: serviceResponse,
      message: `Usuario borrado ${id}`,
      title: `Eliminado`,
    };
  }

  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: TeacherEntity[]) {
    const serviceResponse = await this.teachersService.removeAll(payload);

    return {
      data: serviceResponse,
      message: `Usuarios eliminados`,
      title: `Eliminado`,
    };
  }

  @Get(':id/teacher-distributions')
  @HttpCode(HttpStatus.OK)
  async findTeacherDistributionsByTeacher(@Param('id', ParseUUIDPipe) id: string,
                                          @Query('schoolPeriodId') schoolPeriodId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherDistributionsService.findTeacherDistributionsByTeacher(id, schoolPeriodId);

    return {
      data: serviceResponse,
      message: `Distrubutivo Docente`,
      title: `Success`,
    };
  }

  @Get(':id/subjects')
  @HttpCode(HttpStatus.OK)
  async findEnrollmentSubjectByTeacher(@Param('id', ParseUUIDPipe) id: string,
                                       @Query() params: any): Promise<ResponseHttpModel> {
    const serviceResponse = await this.enrollmentsService.findEnrollmentSubjectsByTeacher(id, params);

    return {
      data: serviceResponse,
      message: `Distrubutivo Docente`,
      title: `Success`,
    };
  }

}
