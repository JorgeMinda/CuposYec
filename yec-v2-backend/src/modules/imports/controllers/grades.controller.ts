import {Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ResponseHttpModel} from '@shared/models';
import {GradesService} from '../services/grades.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {join} from 'path';
import {excelFileFilter, fileFilter, getFileName} from '@shared/helpers';

@ApiTags('Imports Grades')
@Controller('imports/grades')
export class GradesController {
    constructor(private readonly gradesService: GradesService) {
    }

    @ApiOperation({summary: 'Import Grades'})
    // @Roles(RoleEnum.ADMIN)
    @Post('')
    @HttpCode(HttpStatus.CREATED)
    @UseInterceptors(
        FileInterceptor('file', {
            storage: diskStorage({
                destination: join(process.cwd(), 'storage/imports'),
                filename: getFileName,
            }),
            fileFilter: excelFileFilter,
        }),
    )
    async importGrades(@UploadedFile() file: Express.Multer.File,@Body() payload: any): Promise<ResponseHttpModel> {
        await this.gradesService.importGrades(file, payload);

        return {
            data: null,
            message: `Calificaciones Importadas Correctamente`,
            title: `Importado`,
        };
    }
}
