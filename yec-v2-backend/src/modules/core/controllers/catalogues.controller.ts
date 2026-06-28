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
import {ResponseHttpModel} from '@shared/models';
import {CataloguesService} from '@core/services';
import {CreateCatalogueDto, FilterCatalogueDto, UpdateCatalogueDto} from '@core/dto';
import {CatalogueEntity} from '@core/entities';
import {CatalogueTypeEnum} from '@shared/enums';
import { PublicRoute } from '@auth/decorators';

@PublicRoute()
@ApiTags('Catalogues')
@Controller('catalogues')
export class CataloguesController {
    constructor(private catalogueService: CataloguesService) {
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() payload: CreateCatalogueDto) {
        const data = await this.catalogueService.create(payload);

        return {
            data,
            message: 'created',
        };
    }
@PublicRoute()
    @ApiOperation({summary: 'List all catalogues'})
    @Get('catalogue')
    @HttpCode(HttpStatus.OK)
    async catalogue(@Query('type') type: CatalogueTypeEnum) {
        const response = await this.catalogueService.catalogue(type);
        return {
            data: response,
            message: `catalogue`,
            title: `Catalogue`,
        } as ResponseHttpModel;
    }
@PublicRoute() 
    @ApiOperation({summary: 'List of catalogues'})
    // @Roles(RoleEnum.ADMIN)
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() params: FilterCatalogueDto) {
        const response = await this.catalogueService.findAll(params);
        return {
            data: response.data,
            pagination: response.pagination,
            message: `index`,
        };
    }

    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        const data = await this.catalogueService.findOne(id);
        return {
            data,
            message: `show ${id}`,
            title: `Success`,
        } as ResponseHttpModel;
    }

    @Put(':id')
    @HttpCode(HttpStatus.CREATED)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateCatalogueDto) {
        const data = await this.catalogueService.update(id, payload);

        return {
            data: data,
            message: `Catalogue updated ${id}`,
            title: `Updated`,
        } as ResponseHttpModel;
    }

    @Delete(':id')
    @HttpCode(HttpStatus.CREATED)
    async remove(@Param('id', ParseUUIDPipe) id: string) {
        const data = await this.catalogueService.remove(id);

        return {
            data,
            message: `Catalogue deleted ${id}`,
            title: `Deleted`,
        };
    }

    @Patch('remove-all')
    @HttpCode(HttpStatus.CREATED)
    async removeAll(@Body() payload: CatalogueEntity[]) {
        const data = await this.catalogueService.removeAll(payload);

        return {
            data,
            message: `Catalogues deleted`,
            title: `Deleted`,
        };
    }

    @PublicRoute()
    @ApiOperation({summary: 'Find Cache'})
    @Get('cache/get')
    @HttpCode(HttpStatus.OK)
    async findCache(): Promise<ResponseHttpModel> {
        const response = await this.catalogueService.findCache();
        return {
            data: response,
            message: `Cache de Catalogos`,
            title: `Cache`,
        };
    }

    @PublicRoute()
    @ApiOperation({summary: 'Load Cache'})
    @Get('cache/load')
    @HttpCode(HttpStatus.OK)
    async loadCache(): Promise<ResponseHttpModel> {
        const response = await this.catalogueService.loadCache();
        return {
            data: response,
            message: `Load Cache de Catalogos`,
            title: `Load Cache`,
        };
    }
}
