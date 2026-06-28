import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseService } from '../services/response.service';
import { CreateResponseDto } from '../dto/response/create-response.dto';
import { UpdateResponseDto } from '../dto/response/update-response.dto';
import { FilterResponseDto } from '../dto/response/filter-response.dto';
import { ResponseHttpModel } from '@shared/models';

@ApiTags('Responses')
@Controller('responses')
export class ResponseController {
  constructor(private readonly responseService: ResponseService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createResponseDto: CreateResponseDto): Promise<ResponseHttpModel> {
    const response = await this.responseService.create(createResponseDto);
    return {
      data: response,
      message: 'Respuesta creada exitosamente',
      title: 'Respuesta Creada',
    };
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() filterResponseDto: FilterResponseDto): Promise<ResponseHttpModel> {
    const { data, count } = await this.responseService.findAll(filterResponseDto);
    return {
      data,
      pagination: { totalItems: count },
      message: 'Respuestas obtenidas exitosamente',
      title: 'Respuestas',
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const response = await this.responseService.findOne(id);
    return {
      data: response,
      message: `Respuesta con ID ${id} obtenida exitosamente`,
      title: 'Respuesta',
    };
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateResponseDto: UpdateResponseDto): Promise<ResponseHttpModel> {
    const response = await this.responseService.update(id, updateResponseDto);
    return {
      data: response,
      message: `Respuesta con ID ${id} actualizada exitosamente`,
      title: 'Respuesta Actualizada',
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    await this.responseService.remove(id);
    return {
      data: null,
      message: `Respuesta con ID ${id} eliminada exitosamente`,
      title: 'Respuesta Eliminada',
    };
  }

  @Patch('remove-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAll(@Body() ids: string[]): Promise<ResponseHttpModel> {
    await this.responseService.removeAll(ids);
    return {
      data: true,
      message: 'Respuesta eliminada exitosamente',
      title: 'Respuesta Eliminadas',
    };
  }
}
