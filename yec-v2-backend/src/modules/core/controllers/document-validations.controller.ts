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
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {
    CareerParallelsService,
    EnrollmentsService,
    SubjectsService,
    TeacherDistributionsService
} from '@core/services';
import {ResponseHttpModel} from '@shared/models';
import {DocumentValidationsService} from "../services/document-validations.service";

@ApiTags('Document Validations')
@Controller('document-validations')
export class DocumentValidationsController {
    constructor(private readonly documentValidationsService: DocumentValidationsService,
                private readonly enrollmentsService: EnrollmentsService,
                private readonly subjectsService: SubjectsService,
                private readonly careerParallelsService: CareerParallelsService,
                private readonly teacherDistributionsService: TeacherDistributionsService,
    ) {
    }

    @ApiOperation({summary: 'Create Career'})
    @Get('student-card/:studentId')
    @HttpCode(HttpStatus.CREATED)
    async studentCard(@Param('studentId') studentId: string, @Query('schoolPeriodId') careerId: string, @Query('schoolPeriodId') schoolPeriodId: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.documentValidationsService.studentCard(studentId, careerId, schoolPeriodId);

        return {
            data: serviceResponse,
            message: 'Student Card',
            title: 'Document Validation',
        };
    }
}
