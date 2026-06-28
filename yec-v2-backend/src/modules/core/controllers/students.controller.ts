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
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FilterStudentDto, UpdateStudentDto } from '@core/dto';
import { StudentEntity } from '@core/entities';
import { EnrollmentsService } from '@core/services';
import { ResponseHttpModel } from '@shared/models';
import { StudentsService } from '../services/students.service';

@ApiTags('Students')
@Controller('students')
export class StudentsController {
  constructor(
    private studentService: StudentsService,
    private enrollmentsService: EnrollmentsService,
  ) {
  }

  @ApiOperation({ summary: 'Lista de todos los usuarios' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catálogo`,
      title: `Catálogo`,
    };
  }

  @ApiOperation({ summary: 'Lista de usuarios' })
  // @Roles(RoleEnum.ADMIN)
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: FilterStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.findAll(params);
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
    const serviceResponse = await this.studentService.findOne(id);
    return {
      data: serviceResponse,
      message: `show ${id}`,
      title: `Éxito`,
    };
  }

  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.update(id, payload);

    return {
      data: serviceResponse,
      message: `Usuario actualizado ${id}`,
      title: `Actualizado`,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.remove(id);

    return {
      data: serviceResponse,
      message: `Usuario eliminado ${id}`,
      title: `Eliminado`,
    };
  }

  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: StudentEntity[]) {
    const serviceResponse = await this.studentService.removeAll(payload);

    return {
      data: serviceResponse,
      message: `Usuarios eliminados`,
      title: `Eliminado`,
    };
  }

  @Patch(':id/personal-information')
  @HttpCode(HttpStatus.CREATED)
  async updatePersonalInformation(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.updatePersonalInformation(id, payload);

    return {
      data: serviceResponse,
      message: `Datos Personales Actualizados`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/academic-data')
  @HttpCode(HttpStatus.CREATED)
  async updateAcademicData(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.updateAcademicData(id, payload);

    return {
      data: serviceResponse,
      message: `Datos Académicos del Estudiante Actualizados`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/other-academic-data')
  @HttpCode(HttpStatus.CREATED)
  async updateOtherAcademicData(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.updateOtherAcademicData(id, payload);

    return {
      data: serviceResponse,
      message: `Otros Datos Académicos del Estudiante Actualizados`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/origin-place')
  @HttpCode(HttpStatus.CREATED)
  async updateOriginPlace(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.updateOriginPlace(id, payload);

    return {
      data: serviceResponse,
      message: `Lugar de Procedencia Actualizado`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/residence-place')
  @HttpCode(HttpStatus.CREATED)
  async updateResidencePlace(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.updateResidencePlace(id, payload);

    return {
      data: serviceResponse,
      message: `Lugar de Residencia Actualizado`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/family-group')
  @HttpCode(HttpStatus.CREATED)
  async updateFamilyGroup(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.updateFamilyGroup(id, payload);

    return {
      data: serviceResponse,
      message: `Datos del Grupo Familiar Actualizados`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/family-economic')
  @HttpCode(HttpStatus.CREATED)
  async updateFamilyEconomic(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.updateFamilyEconomic(id, payload);

    return {
      data: serviceResponse,
      message: `Otros Datos Económicos Familiares Actualizados`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/family-health')
  @HttpCode(HttpStatus.CREATED)
  async updateFamilyHealth(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.updateFamilyHealth(id, payload);

    return {
      data: serviceResponse,
      message: `Antecedentes de Salud de la Familia Actualizados`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/housing-data')
  @HttpCode(HttpStatus.CREATED)
  async updateHousingData(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.updateHousingData(id, payload);

    return {
      data: serviceResponse,
      message: `Datos de la Vivienda del Estudiante Actualizados`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/migration-country')
  @HttpCode(HttpStatus.CREATED)
  async updateMigrationCountry(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.updateMigrationCountry(id, payload);

    return {
      data: serviceResponse,
      message: `Migración de País Actualizado`,
      title: `Actualizado`,
    };
  }

  @Patch(':id/psychosocial-section')
  @HttpCode(HttpStatus.CREATED)
  async updatePsychosocialSection(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateStudentDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.studentService.updatePsychosocialSection(id, payload);

    return {
      data: serviceResponse,
      message: `Sección Psicosocial Actualizada`,
      title: `Actualizado`,
    };
  }

  @Get(':id/enrollment-details')
  @HttpCode(HttpStatus.OK)
  async findEnrollmentsDetailsByStudent(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.enrollmentsService.findEnrollmentsByStudent(id);

    return {
      data: serviceResponse,
      message: `Success`,
      title: `GET`,
    };
  }

  @Get(':id/last-enrollment-detail')
  @HttpCode(HttpStatus.OK)
  async findLastEnrollmentDetailByStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('careerId', ParseUUIDPipe) careerId: string,
    ): Promise<ResponseHttpModel> {
    const serviceResponse = await this.enrollmentsService.findLastEnrollmentDetailByStudent(id,careerId);

    return {
      data: serviceResponse,
      message: `Success`,
      title: `GET`,
    };
  }

  @Get(':id/enrollments')
  @HttpCode(HttpStatus.OK)
  async findEnrollmentByStudent(@Param('id', ParseUUIDPipe) id: string, @Query('careerId') careerId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.enrollmentsService.findEnrollmentByStudent(id, careerId);

    return {
      data: serviceResponse,
      message: `Success`,
      title: `GET`,
    };
  }

  @Get(':id/enrollment-subjects')
  @HttpCode(HttpStatus.OK)
  async findEnrollmentSubjectsByStudent(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('schoolPeriodId') schoolPeriodId: string,
    @Query('careerId') careerId: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.enrollmentsService.findEnrollmentSubjectsByStudent(id, schoolPeriodId,careerId);

    return {
      data: serviceResponse,
      message: `Success`,
      title: `GET`,
    };
  }
}
