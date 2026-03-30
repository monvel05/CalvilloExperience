import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular/standalone';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastController = inject(ToastController); 

  // 1. Obtenemos el token con el nombre exacto que usó tu compañero
  const token = localStorage.getItem('token');

  // 2. Si hay token, se lo pegamos a la petición original
  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // 3. Dejamos pasar la petición y vigilamos si el servidor nos regresa un error
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      if (error.status === 401) {
        console.warn('Error 401: Sesión expirada');
        
        // Limpiamos los datos exactos que guardó tu compañero
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        // Mostramos alerta y mandamos al login
        mostrarAlerta(toastController, 'Tu sesión ha expirado. Vuelve a ingresar.', 'danger');
        router.navigate(['/login']); 
      } 
      else if (error.status === 403) {
        console.warn('Error 403: Permisos insuficientes');
        mostrarAlerta(toastController, 'No tienes permisos para realizar esta acción.', 'warning');
      }

      return throwError(() => error);
    })
  );
};

// Función para crear las alertas visuales (Toasts) de Ionic
async function mostrarAlerta(toastController: ToastController, mensaje: string, color: string) {
  const toast = await toastController.create({
    message: mensaje,
    duration: 3500, 
    color: color,
    position: 'bottom',
    icon: 'alert-circle-outline'
  });
  await toast.present();
}