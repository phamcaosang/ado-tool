import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { base64Encode } from '../../shared/utils';
import { CONFIGS } from '../../shared/variables';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const patToken = CONFIGS.pat;
        if (patToken) {
            const token = base64Encode(patToken);

            const authReq = req.clone({
                setHeaders: {
                    Authorization: `Basic ${token}`
                }
            });
            return next.handle(authReq);
        }

        return next.handle(req).pipe(timeout(30000)) //timeout 30seconds
    }
}
