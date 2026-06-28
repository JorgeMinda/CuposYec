import {
    Controller,
    Post,
    UseInterceptors,
    UploadedFile,
    Param,
    ParseUUIDPipe,
    Get,
    Res,
    UploadedFiles,
    Query,
    Delete, Body
} from '@nestjs/common';
import {FileInterceptor, FilesInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {FilesService} from '@common/services';
import {getFileName, fileFilter, imageFilter} from '@shared/helpers';
import {ResponseHttpModel} from '@shared/models';
import {join} from 'path';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {FilterFileDto} from '@common/dto';
import * as fs from 'fs';

@ApiTags('Files')
@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {
    }

    @ApiOperation({summary: 'Upload File'})
    @Post(':modelId/upload')
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: join(process.cwd(), 'storage/private/uploads', `${(new Date()).getFullYear()}/${(new Date()).getMonth()}`),
                filename: getFileName,
            }),
            fileFilter: fileFilter,
            limits: {fieldSize: 10},
        }),
    )
    async uploadFile(@UploadedFile() file: Express.Multer.File, @Param('modelId', ParseUUIDPipe) modelId: string,
                     @Query('typeId') typeId: string): Promise<ResponseHttpModel> {

        const response = await this.filesService.uploadFile(file, modelId, typeId);
        return {
            data: response,
            message: 'Archivo Subido Correctamente',
            title: 'Archivo Subido',
        };
    }

    @ApiOperation({summary: 'Upload Files'})
    @Post(':modelId/uploads')
    @UseInterceptors(FilesInterceptor('files[]', 10, {
        storage: diskStorage({
            destination: join(process.cwd(), 'storage/private/uploads', `${new Date().getFullYear()}/${new Date().getMonth()}`),
            filename: getFileName,
        }),
        fileFilter: fileFilter,
        limits: {fieldSize: 10},
    }),)
    async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Param('modelId', ParseUUIDPipe) modelId: string,
                      @Body() payload: any): Promise<ResponseHttpModel> {
        await this.filesService.uploadFiles(files, modelId);

        return {
            data: null,
            message: 'Archivos Subidos Correctamente',
            title: 'Archivos Subidos',
        };
    }

    @ApiOperation({summary: 'Download File'})
    @Get(':id/download')
    async download(@Param('id', ParseUUIDPipe) id: string, @Res() res): Promise<ResponseHttpModel> {
        const path = await this.filesService.getPath(id);

        return {
            data: res.sendFile(path),
            message: 'Download File',
            title: 'Download',
        };
    }

    @ApiOperation({summary: 'Find By Model'})
    @Get('models/:modelId')
    async findByModel(@Param('modelId', ParseUUIDPipe) modelId: string, @Query() params: FilterFileDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.filesService.findByModel(modelId, params);

        return {
            data: serviceResponse.data,
            pagination: serviceResponse.pagination,
            message: 'Find Files',
            title: 'Find By Model',
        };
    }

    @ApiOperation({summary: 'Delete'})
    @Delete('/:id')
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.filesService.remove(id);

        return {
            data: serviceResponse,
            message: 'Archivo Eliminado',
            title: 'Eliminado',
        };
    }

    @ApiOperation({summary: 'Read Files'})
    @Get('read-files')
    async readFiles(): Promise<ResponseHttpModel> {
        const path = 'C:\\Users\\cesar.tamayo\\Desktop\\blacibu\\files';
        const files = fs.readdirSync(path);
        files.forEach(file => {
                const pathFile = join(path, file);
                const newPathFile = pathFile
                    .replace('á', 'a')
                    .replace('é', 'e')
                    .replace('í', 'i')
                    .replace('ó', 'o')
                    .replace('ú', 'u');
                const dataFile = fs.lstatSync(pathFile);
                fs.rename(pathFile, newPathFile, function (err) {
                    if (err) console.log('ERROR: ' + err);
                });
            }
        )

        return {data: null, message: '', title: ''};
    }
}
