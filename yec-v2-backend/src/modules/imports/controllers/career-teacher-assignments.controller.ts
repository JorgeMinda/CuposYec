import {Body, Controller, Get, HttpCode, HttpStatus, Post, UploadedFile, UseInterceptors} from '@nestjs/common';
import {ApiOperation, ApiTags} from '@nestjs/swagger';
import {ResponseHttpModel} from '@shared/models';
import {GradesService} from '../services/grades.service';
import {FileInterceptor} from '@nestjs/platform-express';
import {diskStorage} from 'multer';
import {join} from 'path';
import {excelFileFilter, fileFilter, getFileName} from '@shared/helpers';
import {TeachersService} from '../services/teachers.service';
import {TeacherDistributionsService} from '../services/teacher-distributions.service';
import {CareerTeacherAssignmentsService} from "../services/career-teacher-assignments.service";

@ApiTags('Imports Teacher Distributions')
@Controller('imports/career-teacher-assignments')
export class CareerTeacherAssignmentsController {
    constructor(private readonly careerTeacherAssignmentsService: CareerTeacherAssignmentsService) {
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
    async import(@UploadedFile() file: Express.Multer.File): Promise<ResponseHttpModel> {
        await this.careerTeacherAssignmentsService.import(file);

        return {
            data: null,
            message: `Docentes Importados Correctamente`,
            title: `Importado`,
        };
    }
}
