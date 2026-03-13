import { HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router'; // Para redirigir al login si falla

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // 1. Obtener el token. 
  // (Asumimos que tu compañero lo guardará en el localStorage cuando termine el Login)
  const token = localStorage.getItem('jwt_token');

  // 2. Clonar la petición original para inyectarle el token en los Headers
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 3. Dejar que la petición continúe su camino hacia el servidor
  return next(authReq).pipe(
    // 4. Atrapar cualquier error que regrese el servidor
    catchError((error) => {
      if (error.status === 401) {
        console.warn('Error 401: Token expirado o no hay sesión. Cerrando sesión...');
        // Aquí limpiamos datos y mandamos al usuario a la pantalla de login
        localStorage.removeItem('jwt_token');
        router.navigate(['/login']);
      } 
      else if (error.status === 403) {
        console.warn('Error 403: Tu rol no tiene permiso para ver esto.');
        // Aquí podrías mostrar una alerta o un Toast en Ionic
      }
      
      return throwError(() => error);
    })
  );
};