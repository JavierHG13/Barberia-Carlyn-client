import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Clonar la petición y agregar withCredentials
  const clonedRequest = req.clone({
    withCredentials: true, // ESTO ES CRÍTICO
    setHeaders: {
      'Content-Type': 'application/json',
    }
  });

  // Si hay token JWT, agregarlo
  const token = authService.getToken();
  let finalRequest = clonedRequest;

  if (token) {
    finalRequest = clonedRequest.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      withCredentials: true
    });
  }

  return next(finalRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/auth/login']);
      }
      return throwError(() => error);
    })
  );
};