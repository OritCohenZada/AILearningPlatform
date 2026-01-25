import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { ToastService } from './services/toast.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  

  const router = inject(Router);
  const toast = inject(ToastService);
  
  const token = localStorage.getItem('token'); 


  let clonedReq = req;
  if (token) {
    clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(clonedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      

      if (error.status === 401) {
        

        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user_name');

        toast.error('Session expired. Please log in again.');

        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};