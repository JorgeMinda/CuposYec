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
    Query
} from '@nestjs/common';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {UpdateCurriculumDto, CreateCurriculumDto, FilterCurriculumDto} from '@core/dto';
import {CurriculumEntity} from '@core/entities';
import {CurriculumsService, SubjectsService} from '@core/services';
import {ResponseHttpModel} from '@shared/models';

@ApiTags('Curriculums')
@Controller('curriculums')
export class CurriculumsController {
    constructor(private readonly curriculumsService: CurriculumsService,
                private readonly subjectsService: SubjectsService) {
    }

    @ApiOperation({summary: 'Create'})
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() payload: CreateCurriculumDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.curriculumsService.create(payload);

        return {
            data: serviceResponse,
            message: 'Malla curricular creada',
            title: 'Creado',
        };
    }

    @ApiOperation({summary: 'Find All'})
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() params: FilterCurriculumDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.curriculumsService.findAll(params);

        return {
            data: serviceResponse.data,
            pagination: serviceResponse.pagination,
            message: 'Find all',
            title: 'Success',
        };
    }

    @ApiOperation({summary: 'Find One'})
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.curriculumsService.findOne(id);

        return {
            data: serviceResponse,
            message: 'Find One',
            title: `Success`,
        };
    }

    @ApiOperation({summary: 'Update'})
    @Put(':id')
    @HttpCode(HttpStatus.CREATED)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateCurriculumDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.curriculumsService.update(id, payload);

        return {
            data: serviceResponse,
            message: 'Malla curricular actualizada',
            title: 'Actualizado',
        };
    }

    @ApiOperation({summary: 'Delete'})
    @Delete(':id')
    @HttpCode(HttpStatus.CREATED)
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.curriculumsService.remove(id);

        return {
            data: serviceResponse,
            message: 'Malla curricular eliminada',
            title: `Eliminado`,
        };
    }

    @ApiOperation({summary: 'Delete All'})
    @Patch('remove-all')
    @HttpCode(HttpStatus.CREATED)
    async removeAll(@Body() payload: CurriculumEntity[]): Promise<ResponseHttpModel> {
        const serviceResponse = await this.curriculumsService.removeAll(payload);

        return {
            data: serviceResponse,
            message: 'Mallas curriculares eliminadas',
            title: 'Eliminadas',
        };
    }

    @ApiOperation({summary: 'Find Subjects By Curriculum'})
    @Get(':id/subjects')
    @HttpCode(HttpStatus.OK)
    async findSubjectsByCurriculum(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.subjectsService.findSubjectsByCurriculum(id);

        return {
            data: serviceResponse,
            message: 'Find One',
            title: `Success`,
        };
    }

    @ApiOperation({summary: 'Find All Subjects By Curriculum'})
    @Get(':id/subjects/all')
    @HttpCode(HttpStatus.OK)
    async findAllSubjectsByCurriculum(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.subjectsService.findAllSubjectsByCurriculum(id);

        return {
            data: serviceResponse,
            message: 'Find One',
            title: `Success`,
        };
    }

    @ApiOperation({summary: 'Hide'})
    @Patch(':id/hide')
    @HttpCode(HttpStatus.CREATED)
    async hide(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.curriculumsService.hide(id);

        return {
            data: serviceResponse,
            message: `Malla Curricular Oculta`,
            title: `Ocultado`,
        };
    }

    @ApiOperation({summary: 'Reactivate'})
    @Patch(':id/reactivate')
    @HttpCode(HttpStatus.CREATED)
    async reactivate(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.curriculumsService.reactivate(id);

        return {
            data: serviceResponse,
            message: `Malla Curricular Reactivada`,
            title: `Reactivado`,
        };
    }
}
