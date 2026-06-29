import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CoreService } from '@utils/services/core.service';
import { CustomMessageService } from '@utils/services/custom-message.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const coreService = inject(CoreService);
    const customMessageService = inject(CustomMessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // 🛡️ Ocultamos siempre los loaders globales del sistema
            coreService.hideLoading();
            coreService.hideProcessing();

            // 🚫 SI ES UN ERROR DE CAPACIDADES O UN MÉTODO DE ESCRITURA CONTROLADO (POST/PUT/PATCH/DELETE)
            // No llamamos a customMessageService para evitar alertas duplicadas en los formularios.
            const isCapacityUrl = req.url.includes('/enrollment-capacities') || req.url.includes('/capacities');
            const isWriteMethod = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method);

            if (error.status === 409 || isWriteMethod || isCapacityUrl) { 
                return throwError(() => error);
            }

            // Alertas genéricas automáticas solo para el resto de errores inesperados de lectura (GET)
            if (error.error?.error !== 'EXPIRED_TOKEN') {
                customMessageService.showHttpError(error.error);
            }

            return throwError(() => error);
        })
    );
};