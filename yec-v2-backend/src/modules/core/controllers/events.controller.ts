import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Patch, Post, Put, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateEventDto, FilterEventDto, UpdateEventDto } from '@core/dto';
import { EventsService } from '@core/services';
import { EventEntity } from '@core/entities';
import { ResponseHttpModel } from '@shared/models';

@ApiTags('Events')
@Controller('events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @ApiOperation({ summary: 'Catalogue' })
  @Get('catalogue')
  @HttpCode(HttpStatus.OK)
  async catalogue(): Promise<ResponseHttpModel> {
    const serviceResponse = await this.eventsService.catalogue();

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: `Catalogue`,
      title: `Catalogue`,
    };
  }

  @ApiOperation({ summary: 'Create' })
  @Post(':modelId')
  @HttpCode(HttpStatus.CREATED)
  async create(@Param('modelId', ParseUUIDPipe) modelId: string, @Body() payload: CreateEventDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.eventsService.create(modelId, payload);

    return {
      data: serviceResponse,
      message: 'Evento Creado',
      title: 'Creación',
    };
  }

  @ApiOperation({ summary: 'Find All' })
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() params: FilterEventDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.eventsService.findAll(params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Find all',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find By Model' })
  @Get('models/:modelId')
  @HttpCode(HttpStatus.OK)
  async findByModel(@Param('modelId', ParseUUIDPipe) modelId: string, @Query() params: FilterEventDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.eventsService.findByModel(modelId, params);

    return {
      data: serviceResponse.data,
      pagination: serviceResponse.pagination,
      message: 'Find all',
      title: 'Success',
    };
  }

  @ApiOperation({ summary: 'Find One' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.eventsService.findOne(id);

    return {
      data: serviceResponse,
      message: `Find One`,
      title: `Success`,
    };
  }

  @ApiOperation({ summary: 'Update' })
  @Put(':id')
  @HttpCode(HttpStatus.CREATED)
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateEventDto): Promise<ResponseHttpModel> {
    const serviceResponse = await this.eventsService.update(id, payload);
    return {
      data: serviceResponse,
      message: `Evento Actualizado`,
      title: `Actualización`,
    };
  }

  @ApiOperation({ summary: 'Delete' })
  @Delete(':id')
  @HttpCode(HttpStatus.CREATED)
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.eventsService.remove(id);
    return {
      data: serviceResponse,
      message: `Evento Eliminado`,
      title: `Eliminación`,
    };
  }

  @ApiOperation({ summary: 'Delete All' })
  @Patch('remove-all')
  @HttpCode(HttpStatus.CREATED)
  async removeAll(@Body() payload: EventEntity[]): Promise<ResponseHttpModel> {
    const serviceResponse = await this.eventsService.removeAll(payload);

    return {
      data: serviceResponse,
      message: `Eventos Eiminados`,
      title: `Eliminaciones`,
    };
  }

  @ApiOperation({ summary: 'Hide' })
  @Patch(':id/hide')
  @HttpCode(HttpStatus.CREATED)
  async hide(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.eventsService.hide(id);

    return {
      data: serviceResponse,
      message: `Periodo Lectivo Oculto`,
      title: `Ocultado`,
    };
  }
  @ApiOperation({ summary: 'Reactivate' })
  @Patch(':id/reactivate')
  @HttpCode(HttpStatus.CREATED)
  async reactivate(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
    const serviceResponse = await this.eventsService.reactivate(id);

    return {
      data: serviceResponse,
      message: `Periodo Lectivo Reactivado`,
      title: `Reactivado`,
    };
  }
}
