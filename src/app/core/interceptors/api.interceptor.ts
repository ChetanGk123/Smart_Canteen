import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
    constructor(public router: Router, public messageService: MessageService) {}

    intercept(
        request: HttpRequest<unknown>,
        next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
        return next.handle(request).pipe(
            tap(
                (response: any) => {
                    if (response instanceof HttpResponse) {
                        if (response.body.result) {
                            if (
                                response.body.message ==
                                'Your session has been expired, please login again!'
                            ) {
                                this.router.navigate(['/login']);
                                //this.toastr.error(response.body.message);
                            } else if (
                                response.body.message ==
                                "You're not authorised to access."
                            ) {
                                this.router.navigate(['/login']);
                                //this.toastr.error(response.body.message);
                            } else if (
                                response.body.message ==
                                "You're not authorised to access., try logging in."
                            ) {
                                this.router.navigate(['/login']);
                                //this.toastr.error(response.body.message);
                            } else if (
                                response.body.message == 'INVALID_LOGIN'
                            ) {
                                this.router.navigate(['/login']);
                                //this.toastr.error(response.body.message);
                            }
                        } else if (response.body?.error_code == '001') {
                        } else if (
                            response.body.message ==
                                "You're not authorised to access." ||
                            response.body.message ==
                                "You're not authorised to access, try logging in."
                        ) {
                            this.router.navigate(['/login']);
                            //this.toastr.error(response.body.message);
                        } else {
                            this.messageService.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: response.body.message,
                            });
                        }
                    }
                },
                (error: any) => {
                    if (error instanceof HttpErrorResponse) {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: error.message,
                        });
                    }
                }
            )
        );
    }
}
