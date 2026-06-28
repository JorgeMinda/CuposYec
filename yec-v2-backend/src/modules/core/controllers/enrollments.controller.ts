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
    Query,
} from '@nestjs/common';
import {ApiTags, ApiOperation} from '@nestjs/swagger';
import {Auth, User} from "@auth/decorators";
import {UserEntity} from "@auth/entities";
import {CreateEnrollmentDto, FilterEnrollmentDto, UpdateEnrollmentDto} from '@core/dto';
import {EnrollmentEntity} from '@core/entities';
import {EnrollmentsService, EnrollmentDetailsService} from '@core/services';
import {ResponseHttpModel} from '@shared/models';

@ApiTags('Enrollments')
@Auth()
@Controller('enrollments')
export class EnrollmentsController {
    constructor(
        private readonly enrollmentsService: EnrollmentsService,
        private readonly enrollmentsDetailService: EnrollmentDetailsService) {
    }

    @ApiOperation({summary: 'Create Enrollment'})
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() payload: CreateEnrollmentDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.create(payload);

        return {
            data: serviceResponse,
            message: 'Reporte de notas fue creada',
            title: 'Reporte de notas creada',
        };
    }

    @ApiOperation({summary: 'Find All enrollments'})
    @Get()
    @HttpCode(HttpStatus.OK)
    async findAll(@Query() params: FilterEnrollmentDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.findAll(params);

        return {
            data: serviceResponse.data,
            pagination: serviceResponse.pagination,
            message: 'Buscar reporte de notas',
            title: 'Success',
        };
    }

    @ApiOperation({summary: 'Find Enrollment'})
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.findOne(id);

        return {
            data: serviceResponse,
            message: `Buscar reporte de notas`,
            title: `Success`,
        };
    }

    @ApiOperation({summary: 'Update Enrollment'})
    @Put(':id')
    @HttpCode(HttpStatus.CREATED)
    async update(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateEnrollmentDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.update(id, payload);

        return {
            data: serviceResponse,
            message: `Matrícula Actualizada`,
            title: `Actualizado`,
        };
    }

    @ApiOperation({summary: 'Update Approved'})
    @Put(':id/enrolled')
    @HttpCode(HttpStatus.CREATED)
    async updateApproved(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateEnrollmentDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.updateApproved(id, payload);

        return {
            data: serviceResponse,
            message: `Matrícula Actualizada`,
            title: `Actualizado`,
        };
    }

    @ApiOperation({summary: 'Update Enrolled'})
    @Put(':id/enrolled')
    @HttpCode(HttpStatus.CREATED)
    async updateEnrolled(@Param('id', ParseUUIDPipe) id: string, @Body() payload: UpdateEnrollmentDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.updateEnrolled(id, payload);

        return {
            data: serviceResponse,
            message: `Matrícula Actualizada`,
            title: `Actualizado`,
        };
    }

    @ApiOperation({summary: 'Delete Career'})
    @Delete(':id')
    @HttpCode(HttpStatus.OK)
    async remove(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.remove(id);
        return {
            data: serviceResponse,
            message: `Reporte de notas fue eliminada`,
            title: `Reporte de notas eliminada`,
        };
    }

    @ApiOperation({summary: 'Delete All enrollments'})
    @Patch('remove-all')
    @HttpCode(HttpStatus.OK)
    async removeAll(@Body() payload: EnrollmentEntity[]): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.removeAll(payload);

        return {
            data: serviceResponse,
            message: `Reporte de notas fueron eliminadas`,
            title: `Reporte de notas eliminadas`,
        };
    }

    @ApiOperation({summary: 'Find Enrollment Details By Enrollment'})
    @Get(':id/enrollment-details')
    @HttpCode(HttpStatus.OK)
    async findEnrollmentDetailsByEnrollment(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsDetailService.findEnrollmentDetailsByEnrollment(id);

        return {
            data: serviceResponse,
            message: `Success`,
            title: `Success`,
        };
    }

    @ApiOperation({summary: 'Send Registration'})
    @Auth()
    @Post('send-registration')
    @HttpCode(HttpStatus.CREATED)
    async sendRegistration(@User() user: UserEntity, @Body() payload: any): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.sendRegistration(user.id, payload);

        return {
            data: serviceResponse,
            message: 'Asignaturas Registradas',
            title: 'Registro',
        };
    }

    @ApiOperation({summary: 'Send Request'})
    @Post(':id/send-request')
    @HttpCode(HttpStatus.CREATED)
    async sendRequest(@User() user: UserEntity, @Param('id') id: string, @Body() payload: UpdateEnrollmentDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.sendRequest(user.id, id, payload);

        return {
            data: serviceResponse,
            message: 'Solicitud Enviada',
            title: 'Solicitud Enviada',
        };
    }

    @ApiOperation({summary: 'Approve Enrollment'})
    @Patch(':id/approve')
    @HttpCode(HttpStatus.CREATED)
    async approve(@Param('id', ParseUUIDPipe) id: string, @User() user: UserEntity, @Body() payload: UpdateEnrollmentDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.approve(id, user.id, payload);
        return {
            data: serviceResponse,
            message: `La solicitud fue aprobada`,
            title: `Aprobada`,
        };
    }

    @ApiOperation({summary: 'Approve Enrollment'})
    @Patch(':id/reject')
    @HttpCode(HttpStatus.CREATED)
    async reject(@Param('id', ParseUUIDPipe) id: string, @User() user: UserEntity, @Body() payload: UpdateEnrollmentDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.reject(id, user.id, payload);
        return {
            data: serviceResponse,
            message: `La solicitud fue rechazada`,
            title: `Rechazada`,
        };
    }

    @ApiOperation({summary: 'Enroll Enrollment'})
    @Patch(':id/enroll')
    @HttpCode(HttpStatus.CREATED)
    async enroll(@Param('id', ParseUUIDPipe) id: string, @User() user: UserEntity, @Body() payload: UpdateEnrollmentDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.enroll(id, user.id, payload);
        return {
            data: serviceResponse,
            message: `La matrícula fue creada`,
            title: `Matriculado`,
        };
    }

    @ApiOperation({summary: 'Enroll Enrollment'})
    @Patch(':id/revoke')
    @HttpCode(HttpStatus.CREATED)
    async revoke(@Param('id', ParseUUIDPipe) id: string, @User() user: UserEntity, @Body() payload: UpdateEnrollmentDto): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.revoke(id, user.id, payload);
        return {
            data: serviceResponse,
            message: `La matrícula fue anulada`,
            title: `Anulada`,
        };
    }

    @ApiOperation({summary: 'Find Enrollment Certificate'})
    @Get(':id')
    @HttpCode(HttpStatus.OK)
    async findEnrollmentCertificateByEnrollment(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.findEnrollmentCertificateByEnrollment(id);

        return {
            data: serviceResponse,
            message: `Buscar reporte de notas`,
            title: `Success`,
        };
    }

    @ApiOperation({summary: 'Recalculate Socioeconomic Forms'})
    @Patch('recalculate-socioeconomic-forms')
    @HttpCode(HttpStatus.OK)
    async recalculateSocioeconomicForm(): Promise<ResponseHttpModel> {
        const serviceResponse = await this.enrollmentsService.recalculateSocioeconomicForm();

        return {
            data: serviceResponse,
            message: `Buscar reporte de notas`,
            title: `Success`,
        };
    }
}
