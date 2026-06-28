import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateGradeDto, FilterGradeDto, UpdateGradeDto } from '@core/dto';
import { GradeEntity } from '@core/entities';
import { GradesService } from '@core/services';
import { ResponseHttpModel } from '@shared/models';

@ApiTags('Grades')
@Controller('grades')
export class TeacherChargesController {
  constructor(private teacherchargesService: GradesService) {}

  @ApiOperation({ summary: 'Create' })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() payload: CreateGradeDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherchargesService.create(payload);

    return {
      data: serviceResponse,
      message: 'fue creada',
      title: 'creada',
    };
  }

  @ApiOperation({ summary: 'Find All' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: FilterGradeDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherchargesService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Buscar todas las ',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherchargesService.findOne(id);

    return {
      data: serviceResponse,
      message: `Buscar`,
      title: `Success`,
    };
  }

  @ApiOperation({ summary: 'Update' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateGradeDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherchargesService.update(id, payload);
    return {
      data: serviceResponse,
      message: `fue actualizada`,
      title: `actualizada`,
    };
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherchargesService.remove(id);
    return {
      data: serviceResponse,
      message: `fue eliminada`,
      title: `eliminada`,
    };
  }

  @ApiOperation({ summary: 'Delete All' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: GradeEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.teacherchargesService.removeAll(payload);

    return {
      data: serviceResponse,
      message: `fueron eliminadas`,
      title: `eliminadas`,
    };
  }
}
