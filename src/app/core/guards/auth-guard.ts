import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Si existe el token, dejamos pasar al usuario
  if (token) {
    return true;
  }

  // Si no hay token, redirigimos al login
  router.navigate(['/login']);
  return false;
};