import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    NotFoundException,
    UnauthorizedException,
    ForbiddenException,
    UnprocessableEntityException,
    BadRequestException,
    ServiceUnavailableException,
} from '@nestjs/common';
import {Request, Response} from 'express';
import {QueryFailedError} from 'typeorm';
import {ErrorResponseHttpModel} from '@shared/models';
import {ExceptionsHandler} from '@nestjs/core/exceptions/exceptions-handler';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const errorResponseHttpModel: ErrorResponseHttpModel = {
            error: 'Server Error',
            message: 'Server Error',
            statusCode: 500,
        };
        let status = 500;

        if (exception instanceof HttpException) {
            const {message, error} = exception.getResponse() as ErrorResponseHttpModel;
            status = exception.getStatus();

            errorResponseHttpModel.error = 'Server Error';
            errorResponseHttpModel.message = message;

            if (exception instanceof BadRequestException) {
                errorResponseHttpModel.error = 'No se pudo procesar su petición';
                errorResponseHttpModel.message = message;
            }

            if (exception instanceof UnprocessableEntityException) {
                errorResponseHttpModel.error = 'Datos no válidos';
                errorResponseHttpModel.message = message;
            }

            if (exception instanceof UnauthorizedException) {
                errorResponseHttpModel.error = error || 'Credenciales no válidas';
                errorResponseHttpModel.message = message ?? 'You do not have authorization.';
            }

            if (exception instanceof NotFoundException) {
                errorResponseHttpModel.error = error || 'Route/Model not found';
                errorResponseHttpModel.message = message;
            }

            if (exception instanceof ForbiddenException) {
                errorResponseHttpModel.error = error || 'Forbidden';
                errorResponseHttpModel.message = message;
            }

            if (exception instanceof ServiceUnavailableException) {
                errorResponseHttpModel.data = {startedAt: '2023-08-25', endedAt: '2023-08-31'};
                errorResponseHttpModel.error = 'El sistema se encuentra en mantenimiento';
                errorResponseHttpModel.message = 'Lamentamos las molestias causadas';
            }

            errorResponseHttpModel.statusCode = exception.getStatus();
        }

        if (exception instanceof QueryFailedError) {
            status = 400;
            errorResponseHttpModel.statusCode = exception.driverError.code || 400;
            errorResponseHttpModel.error = exception.name || 'QueryFailedError';
            errorResponseHttpModel.message = exception.driverError.detail || 'Query Error';
        }

        if (exception instanceof ExceptionsHandler) {
            status = 400;
            // errorResponseHttpModel.statusCode = exception..code || 400;
            // errorResponseHttpModel.error = exception.name || 'QueryFailedError';
            // errorResponseHttpModel.message =
            //   exception.driverError.detail || 'Query Error';
        }

        if (exception instanceof Error && status === 500) {
            status = 400;
            errorResponseHttpModel.statusCode = 400;
            errorResponseHttpModel.error = exception.name || 'Error';
            errorResponseHttpModel.message = exception.message || 'Error';
        }

        response.status(status).json(errorResponseHttpModel);
    }
}
