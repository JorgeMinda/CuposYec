import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CareerParallelsService } from '@core/services';
import { CreateCareerParallelDto, UpdateCareerParallelDto } from '@core/dto';
import { ResponseHttpModel } from '@shared/models';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Career Parallels')
@Controller('career-parallels')
export class CareerParallelsController {
    constructor(private readonly careerParallelsService: CareerParallelsService) {
    }

    @PublicRoute()
    @ApiOperation({ summary: 'Create Career Parallel' })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() payload: CreateCareerParallelDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.careerParallelsService.create(payload);

        return {
            data: serviceResponse,
            message: 'Cupo de paralelo fue creado',
            title: 'Creado',
        };
    }

    @PublicRoute()
    @ApiOperation({ summary: 'Update Career Parallel' })
    @Put(':id')
    @HttpCode(HttpStatus.CREATED)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateCareerParallelDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.careerParallelsService.update(id, payload);

        return {
            data: serviceResponse,
            message: 'Cupo de paralelo fue actualizado',
            title: 'Actualizado',
        };
    }

    @PublicRoute()
    @ApiOperation({ summary: 'Delete Career Parallel' })
    @Delete(':id')
    @HttpCode(HttpStatus.CREATED)
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.careerParallelsService.remove(id);

        return {
            data: serviceResponse,
            message: 'Cupo de paralelo fue eliminado',
            title: 'Eliminado',
        };
    }

    @PublicRoute()
    @ApiOperation({ summary: 'Find Capacity By Career, Parallel, Workday, AcademicPeriod' })
    @Get('capacity/:careerId/:parallelId/:workdayId/:academicPeriodId')
    @HttpCode(HttpStatus.OK)
    async findCapacityByCareer(
        @Param('careerId', ParseUUIDPipe) careerId: string,
        @Param('parallelId', ParseUUIDPipe) parallelId: string,
        @Param('workdayId', ParseUUIDPipe) workdayId: string,
        @Param('academicPeriodId', ParseUUIDPipe) academicPeriodId: string,
    ): Promise<ResponseHttpModel> {
        const serviceResponse = await this.careerParallelsService.findCapacityByCareer(careerId, parallelId, workdayId, academicPeriodId);

        return {
            data: serviceResponse,
            message: 'Success',
            title: 'Success',
        };
    }
}