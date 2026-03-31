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
  
  // 1. Obtener credenciales con las LLAVES CORRECTAS que usamos en el login
  const token = localStorage.getItem('token'); 
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
    router.navigate(['/login']); // Mandamos al login (que no debe tener guard)
    return false;
  }

  // 3. Validación de Autorización (¿Tiene el rol adecuado?)
  const requiredRoles = route.data?.['roles'];

  if (requiredRoles && requiredRoles.length > 0) {
    // Usamos 'some' y convertimos a Number para que '3' (texto) y 3 (número) sean lo mismo
    const tienePermiso = requiredRoles.some((rolPermitido: any) => Number(rolPermitido) === Number(userRole));

    if (!tienePermiso) {
      console.error(`🚫 Guard: Acceso denegado. Rol actual: '${userRole}'. Requerido: '${requiredRoles.join(', ')}'`);
      
      // ¡ROMPE EL BUCLE! Redirigimos a una ruta libre de guards.
      router.navigate(['/login']); 
      return false; 
    }
  }

  // 4. Todo en orden, se permite el paso
  console.log('✅ Guard: Pase autorizado.'); 
  return true; 
};