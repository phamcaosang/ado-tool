import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent
} from '@angular/common/http';
import { Observable, timeout } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { Buffer } from 'buffer';

@Injectable({
    providedIn: 'root'
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(private configService: ConfigurationService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const patToken = this.configService.getConfigValue<string>('pat');
        if (!req.url.includes('config.json') && patToken) {
            const token = this.base64Encode(patToken);

            const authReq = req.clone({
                setHeaders: {
                    Authorization: `Basic ${token}`
                }
            });
            return next.handle(authReq);
        }

        return next.handle(req).pipe(timeout(30000)) //timeout 30seconds
    }

    base64Encode = (pat: string) => {
        return Buffer.from(pat).toString("base64");
    }
}
