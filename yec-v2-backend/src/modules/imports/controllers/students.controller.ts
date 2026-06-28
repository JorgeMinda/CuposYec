import {Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ResponseHttpModel} from '@shared/models';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {join} from 'path';
import {excelFileFilter, getFileName} from '@shared/helpers';
import { StudentsService } from '../services/students.service';

@ApiTags('Imports Teachers')
@Controller('imports/students')
export class StudentsController {
    constructor(private readonly studentsService: StudentsService) {
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
    async importTeachers(@UploadedFile() file: Express.Multer.File): Promise<ResponseHttpModel> {
        await this.studentsService.importStudents(file);

        return {
            data: null,
            message: `Docentes Importadas Correctamente`,
            title: `Importado`,
        };
    }
}
