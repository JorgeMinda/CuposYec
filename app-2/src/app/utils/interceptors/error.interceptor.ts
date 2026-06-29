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
            // 🛡️ SI ES UN ERROR 409 (Duplicado): Ocultamos los spinners y dejamos 
            // pasar el error limpio para que se dispare tu alerta <p-toast> personalizada
            if (error.status === 409) {
                coreService.hideLoading();
                coreService.hideProcessing();
                return throwError(() => error);
            }

            // Para cualquier otro error genérico de la app, mantiene tu lógica original
            if (error.error?.error !== 'EXPIRED_TOKEN') {
                coreService.hideLoading();
                coreService.hideProcessing();
                customMessageService.showHttpError(error.error);
            }

            return throwError(() => error);
        })
    );
};