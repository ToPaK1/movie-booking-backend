import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const auth = inject(AuthService);
  const router = inject(Router);
  if (!token || req.url.includes('/auth/login') || req.url.includes('/auth/signup')) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })).pipe(catchError(error => {
    if (error.status === 401) { auth.logout(); router.navigate(['/login'], { queryParams: { reason: 'session-expired' } }); }
    return throwError(() => error);
  }));
};
