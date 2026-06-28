import {Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ResponseHttpModel} from '@shared/models';
import {GradesService} from '../services/grades.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {join} from 'path';
import {excelFileFilter, fileFilter, getFileName} from '@shared/helpers';
import { TeachersService } from '../services/teachers.service';
import { TeacherDistributionsService } from '../services/teacher-distributions.service';
import { TeacherEvaluationsService } from '../services/teacher-evaluations.service';

@ApiTags('Imports Teacher Distributions')
@Controller('imports/teacher-evaluations')
export class TeacherEvaluationsController {
    constructor(private readonly teacherEvaluationsService: TeacherEvaluationsService) {
    }

    @ApiOperation({summary: 'Import Teacher Evaluations'})
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
    async import(@UploadedFile() file: Express.Multer.File): Promise<ResponseHttpModel> {
        await this.teacherEvaluationsService.import(file);

        return {
            data: null,
            message: `Evaluaciones Importadas Correctamente`,
            title: `Importado`,
        };
    }
}
