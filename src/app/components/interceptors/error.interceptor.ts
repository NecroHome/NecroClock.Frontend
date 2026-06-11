import { HttpErrorResponse, HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { MessageService } from "primeng/api";
import { catchError, throwError } from "rxjs";

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
    const messageService = inject(MessageService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            console.error("HTTP Error", error);

            const message =
                error.error?.details ||
                error.error?.message ||
                error.message ||
                "Ocorreu um erro inesperado.";

            messageService.add({
                severity: "error",
                summary: "Erro",
                detail: message
            });

            return throwError(() => error);
        }));
};