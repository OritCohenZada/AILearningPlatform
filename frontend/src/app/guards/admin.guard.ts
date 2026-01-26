import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';

export const adminGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userRole = localStorage.getItem('user_role');
  
  if (userRole === 'admin') {
    return true;
  } else {
    router.navigate(['/user']);
    return false;
  }
};