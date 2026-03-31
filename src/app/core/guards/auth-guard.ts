import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * @description
 * Guard de autenticación y autorización principal del proyecto.
 * Verifica si el usuario tiene una sesión activa mediante un token.
 * Valida si el rol numérico del usuario coincide con los permisos requeridos.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. CORRECCIÓN CRÍTICA: Usamos 'jwt_token' para coincidir con AuthService e Interceptor
  const token = localStorage.getItem('jwt_token'); 
  const userString = localStorage.getItem('user'); 
  
  // Variable para almacenar el rol (idTipoUsuario)
  let userRole: number | null = null;
  
  if (userString) {
    try {
      const user = JSON.parse(userString);
      userRole = user.idTipoUsuario; // Extraemos el 1 (Admin), 2 (Turista) o 3 (Negocio)
    } catch (error) {
      console.error('Error al procesar los datos del usuario:', error);
    }
  }

  // 2. Validación de Autenticación (¿Inició sesión?)
  if (!token) {
    console.warn('❌ Guard: Bloqueado. No hay sesión activa. Redirigiendo al login...');
    router.navigate(['/login']); 
    return false;
  }

  // 3. Validación de Autorización (¿Tiene el rol adecuado?)
  const requiredRoles = route.data?.['roles'];

  if (requiredRoles && requiredRoles.length > 0) {
    const tienePermiso = requiredRoles.some((rolPermitido: any) => Number(rolPermitido) === Number(userRole));

    if (!tienePermiso) {
      console.error(`🚫 Guard: Acceso denegado. Rol actual: '${userRole}'. Requerido: '${requiredRoles.join(', ')}'`);
      
      // MEJORA UX: Redirección inteligente basada en el rol
      if (userRole === 1) {
        router.navigate(['/administrador-inicio']);
      } else if (userRole === 2) {
        router.navigate(['/turista-inicio']);
      } else if (userRole === 3) {
        router.navigate(['/negocio-inicio']);
      } else {
        // Por si acaso los datos se corrompieron
        localStorage.clear(); 
        router.navigate(['/login']); 
      }
      return false; 
    }
  }

  // 4. Todo en orden, se permite el paso
  console.log('✅ Guard: Pase autorizado.'); 
  return true; 
};