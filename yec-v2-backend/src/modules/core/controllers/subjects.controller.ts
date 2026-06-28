import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateSubjectDto, FilterSubjectDto, UpdateSubjectDto } from '@core/dto';
import { SubjectEntity } from '@core/entities';
import { ResponseHttpModel } from '@shared/models';
import { SubjectsService } from '@core/services';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private subjectsService: SubjectsService) {}

  @ApiOperation({ summary: 'Create' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateSubjectDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.subjectsService.create(payload);

    return {
      data: serviceResponse,
      message: 'Creacion de asignaturas',
      title: 'Asignatura creada',
    };
  }

  @ApiOperation({ summary: 'Find All' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: FilterSubjectDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.subjectsService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Buscar todas las asignaturas',
      title: 'success',
    };
  }

  @ApiOperation({ summary: 'Find One' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.subjectsService.findOne(id);

    return {
      data: serviceResponse,
      message: `Buscar asignatura`,
      title: `Success`,
    };
  }

  @ApiOperation({ summary: 'Update' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateSubjectDto) {
    const serviceResponse = await this.subjectsService.update(id, payload);

    return {
      data: serviceResponse,
      message: 'Actualización de asignatura',
      title: 'Asignatura actualizada',
    };
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.subjectsService.remove(id);

    return {
      data: serviceResponse,
      message: 'Eliminación de asignatura',
      title: 'Asignatura eliminada',
    };
  }

  @ApiOperation({ summary: 'Delete All' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: SubjectEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.subjectsService.removeAll(payload);

    return {
      data: serviceResponse,
      message: 'Eliminacion de asignaturas',
      title: 'Asignaturas eliminadas',
    };
  }

  @ApiOperation({ summary: 'Hide' })
  @Patch(':id/hide')
  @HttpCode(HttpStatus.CREATED)
  async hide(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.subjectsService.hide(id);

    return {
      data: serviceResponse,
      message: `Asignatura Oculta`,
      title: `Ocultado`,
    };
  }

  @ApiOperation({ summary: 'Reactivate' })
  @Patch(':id/reactivate')
  @HttpCode(HttpStatus.CREATED)
  async reactivate(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.subjectsService.reactivate(id);

    return {
      data: serviceResponse,
      message: `Asignatura Reactivada`,
      title: `Reactivado`,
    };
  }
}