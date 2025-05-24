import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = localStorage.getItem('my-auth-token');

    if (authToken) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${JSON.parse(authToken).token}`
        }
      });
      return next.handle(cloned);
    }

    return next.handle(req);
  }
}
