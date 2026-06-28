import {Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ResponseHttpModel} from '@shared/models';
import {GradesService} from '../services/grades.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {join} from 'path';
import {excelFileFilter, fileFilter, getFileName} from '@shared/helpers';
import { TeachersService } from '../services/teachers.service';

@ApiTags('Imports Teachers')
@Controller('imports/teachers')
export class TeachersController {
    constructor(private readonly teachersService: TeachersService) {
    }

    @ApiOperation({summary: 'Import Teachers'})
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
    async importTeachers(@UploadedFile() file: Express.Multer.File,@Body() payload: any): Promise<ResponseHttpModel> {
        await this.teachersService.importTeachers(file, payload);

        return {
            data: null,
            message: `Docentes Importados Correctamente`,
            title: `Importado`,
        };
    }
}
