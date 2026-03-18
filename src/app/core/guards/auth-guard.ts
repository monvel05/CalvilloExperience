import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * @description
 * Guard de autenticación y autorización principal del proyecto.
 * Verifica si el usuario tiene una sesión activa mediante un token en localStorage.
 * Además, valida si el rol del usuario coincide con los permisos requeridos por la ruta.
 * * @param route Información de la ruta solicitada, incluye los 'roles' permitidos en `app.routes.ts`.
 * @param state Estado actual del árbol de rutas de Angular.
 * @returns {boolean} `true` si el acceso es permitido; `false` si es bloqueado (y redirige según el caso).
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. Obtener credenciales del almacenamiento local
  // ⚠️ IMPORTANTE PARA EL EQUIPO: Deben usar exactamente estas llaves al hacer el login.
  const token = localStorage.getItem('jwt_token'); 
  const userRole = localStorage.getItem('user_role'); 

  // 2. Validación de Autenticación (¿Inició sesión?)
  if (!token) {
    console.warn('❌ Guard: Bloqueado. No hay sesión activa. Redirigiendo al login...');
    router.navigate(['/login']);
    return false;
  }

  // 3. Validación de Autorización (¿Tiene el rol adecuado?)
  const requiredRoles = route.data?.['roles'] as Array<string>;

  if (requiredRoles && requiredRoles.length > 0) {
    // Si la ruta exige roles, verificamos que el usuario tenga uno válido
    if (!userRole || !requiredRoles.includes(userRole)) {
      console.error(`🚫 Guard: Acceso denegado. Rol actual: '${userRole || 'Ninguno'}'. Requerido: '${requiredRoles.join(', ')}'`);
      
      // Como no tiene permiso, lo regresamos a una ruta segura o simplemente cancelamos.
      // Puedes cambiar '/home' por una vista genérica de error o el inicio del turista.
      router.navigate(['/home']); 
      return false; 
    }
  }

  // 4. Todo en orden, se permite el paso
  // console.log('✅ Guard: Pase autorizado.'); // Comentado para no saturar la consola en producción
  return true; 
};