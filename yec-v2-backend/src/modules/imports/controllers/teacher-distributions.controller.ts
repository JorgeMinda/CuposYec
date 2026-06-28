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

@ApiTags('Imports Teacher Distributions')
@Controller('imports/teacher-distributions')
export class TeacherDistributionsController {
    constructor(private readonly teacherDistributionsService: TeacherDistributionsService) {
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
    async import(@UploadedFile() file: Express.Multer.File,@Body() payload: any): Promise<ResponseHttpModel> {
       const response = await this.teacherDistributionsService.import(file, payload);

        return {
            data: response,
            message: `Docentes Importados Correctamente`,
            title: `Importado`,
        };
    }
}
