import {Controller, Get, HttpCode, HttpStatus,} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ResponseHttpModel} from '@shared/models';
import {LocationsService} from '@core/services';
import { PublicRoute } from '@auth/decorators';

@ApiTags('Locations')
@Controller('locations')
export class LocationsController {
    constructor(private locationsService: LocationsService) {
    }

    @PublicRoute()
    @ApiOperation({summary: 'Find Cache'})
    @Get('cache/get')
    @HttpCode(HttpStatus.OK)
    async findCache(): Promise<ResponseHttpModel> {
        const response = await this.locationsService.findCache();
        return {
            data: response,
            message: `Cache de Locations`,
            title: `Cache`,
        };
    }

    @ApiOperation({summary: 'Load Cache'})
    @Get('cache/load')
    @HttpCode(HttpStatus.OK)
    async loadCache(): Promise<ResponseHttpModel> {
        const response = await this.locationsService.loadCache();
        return {
            data: response,
            message: `Load Cache de Locations`,
            title: `Load Cache`,
        };
    }
}
