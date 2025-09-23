import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the authentication token from your AuthService or localStorage
    const token = this.authService.getAuthToken(); 

    if (token) {
      // Clone the request and add the authorization header
      const clonedRequest = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      // Pass the modified request to the next handler
      return next.handle(clonedRequest);
    }
    return next.handle(req);  // If no token, pass the original request
  }
}
