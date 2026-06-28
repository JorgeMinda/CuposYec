import {
    Controller,
    Get,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ClassroomsService } from '@core/services';
import { ResponseHttpModel } from '@shared/models';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Classrooms')
@Controller('classrooms')
export class ClassroomsController {
    constructor(private readonly classroomsService: ClassroomsService) {
    }

    @PublicRoute()
    @ApiOperation({ summary: 'Find All Classrooms' })
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(): Promise<ResponseHttpModel> {
        const serviceResponse = await this.classroomsService.findAllSimple();

        return {
            data: serviceResponse,
            message: 'Lista de aulas',
            title: 'Success',
        };
    }
}