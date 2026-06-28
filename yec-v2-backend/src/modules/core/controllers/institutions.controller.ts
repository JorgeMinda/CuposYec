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
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {CreateInstitutionDto, FilterCareerDto, FilterInstitutionDto, UpdateInstitutionDto} from '@core/dto';
import {InstitutionEntity} from '@core/entities';
import {CareersService, InstitutionsService, SchoolPeriodsService} from '@core/services';
import {ResponseHttpModel} from '@shared/models';
import {Auth, User} from '@auth/decorators';
import {UserEntity} from '@auth/entities';

@ApiTags('Institutions')
@Controller('institutions')
export class InstitutionsController {
    constructor(private instituteService: InstitutionsService,
                private careersService: CareersService,
                private schoolPeriodsService: SchoolPeriodsService) {
    }

    @ApiOperation({summary: 'Create'})
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() payload: CreateInstitutionDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.instituteService.create(payload);
        return {
            data: serviceResponse,
            message: `Institución Creada`,
            title: 'Creado',
        };
    }

    @ApiOperation({summary: 'Find All'})
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() params: FilterInstitutionDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.instituteService.findAll(params);
        return {
            data: serviceResponse.data,
            pagination: serviceResponse.pagination,
            message: `Find all`,
            title: 'Success',
        };
    }

    @ApiOperation({summary: 'Find One'})
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.instituteService.findOne(id);
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
        const serviceResponse = await this.instituteService.hide(id);

        return {
            data: serviceResponse,
            message: `Institución Oculta`,
            title: `Ocultada`,
        };
    }

    @ApiOperation({summary: 'Update'})
    @Put(':id')
    @HttpCode(HttpStatus.CREATED)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateInstitutionDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.instituteService.update(id, payload);
        return {
            data: serviceResponse,
            message: 'Institución Actualizada',
            title: `Actualizada`,
        };
    }

    @ApiOperation({summary: 'Reactivate'})
    @Patch(':id/reactivate')
    @HttpCode(HttpStatus.CREATED)
    async reactivate(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.instituteService.reactivate(id);

        return {
            data: serviceResponse,
            message: `Institución Reactivada`,
            title: `Reactivada`,
        };
    }

    @ApiOperation({summary: 'Delete'})
    @Delete(':id')
    @HttpCode(HttpStatus.CREATED)
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.instituteService.remove(id);
        return {
            data: serviceResponse,
            message: 'Institución Eliminada',
            title: 'Eliminada',
        };
    }

    @ApiOperation({summary: 'Delete All'})
    @Patch('remove-all')
    @HttpCode(HttpStatus.CREATED)
    async removeAll(@Body() payload: InstitutionEntity[]): Promise<ResponseHttpModel> {
        const serviceResponse = await this.instituteService.removeAll(payload);

        return {
            data: serviceResponse,
            message: 'Instituciones Eliminadas',
            title: 'Eliminadas',
        };
    }

    @ApiOperation({summary: 'Enable'})
    @Patch(':id')
    @HttpCode(HttpStatus.CREATED)
    async enable(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.instituteService.remove(id);
        return {
            data: serviceResponse,
            message: 'Institución Habilitada',
            title: 'Habilitada',
        };
    }

    @ApiOperation({summary: 'Disable'})
    @Patch(':id')
    @HttpCode(HttpStatus.CREATED)
    async disable(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.instituteService.remove(id);
        return {
            data: serviceResponse,
            message: 'Institución Inhabilitada',
            title: 'Inhabilitada',
        };
    }

    @ApiOperation({summary: 'Find Careers By Institution'})
    @Get(':id/careers')
    @HttpCode(HttpStatus.OK)
    async findCareersByInstitution(@Param('id', ParseUUIDPipe) id: string, @Query() params: FilterCareerDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.careersService.findCareersByInstitution(id, params);
        return {
            data: serviceResponse.data,
            pagination: serviceResponse.pagination,
            message: `Find Careers By Institution`,
            title: 'Success',
        };
    }

    @ApiOperation({summary: 'Find School Periods By Institution'})
    @Get(':id/school-periods')
    @HttpCode(HttpStatus.OK)
    async findSchoolPeriodsByInstitution(@Param('id', ParseUUIDPipe) id: string, @Query() params: FilterCareerDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.schoolPeriodsService.findByInstitution(id, params);
        return {
            data: serviceResponse.data,
            pagination: serviceResponse.pagination,
            message: `Find School Periods By Institution`,
            title: 'Success',
        };
    }

    @ApiOperation({summary: 'Find Institutions By User'})
    @Get(':id/careers')
    @HttpCode(HttpStatus.OK)
    async findByUser(@Param('userId', ParseUUIDPipe) userId: string, @Query() params: FilterInstitutionDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.instituteService.findByUser(userId, params);
        return {
            data: serviceResponse.data,
            pagination: serviceResponse.pagination,
            message: `Find Institutions By User`,
            title: 'Success',
        };
    }

    @ApiOperation({summary: 'Find Institutions By Authenticated User'})
    @Auth()
    @Get('users/authenticated')
    @HttpCode(HttpStatus.OK)
    async findByAuthenticatedUser(@User() user: UserEntity): Promise<ResponseHttpModel> {
        const serviceResponse = await this.instituteService.findInstitutionsByAuthenticatedUser(user);
        return {
            data: serviceResponse.data,
            pagination: serviceResponse.pagination,
            message: 'Find Institutions By Authenticated User',
            title: `Success`,
        };
    }
}
