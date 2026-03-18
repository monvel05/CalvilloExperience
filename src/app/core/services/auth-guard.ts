import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  console.log('🚨 EL GUARDIA ESTÁ REVISANDO LA PUERTA 🚨');
  
  const token = localStorage.getItem('jwt_token');
  const userRole = localStorage.getItem('user_role'); 
  
  console.log('👉 Token que traes:', token);
  console.log('👉 Rol que traes:', userRole);

  if (!token) {
    console.warn('❌ Bloqueado: No traes token (no has iniciado sesión)');
    return false;
  }

  // Leemos qué roles exige la ruta
  const requiredRoles = route.data?.['roles'] as Array<string>;
  console.log('👉 Roles permitidos en esta zona:', requiredRoles);

  if (requiredRoles && requiredRoles.length > 0) {
    // Si tu rol no está en la lista de permitidos, te bloquea
    if (!userRole || !requiredRoles.includes(userRole)) {
      console.error(`BLOQUEADO: Eres '${userRole}' y la ruta exige '${requiredRoles}'`);
      
      // En lugar de mandarte a home, por ahora solo cancelamos la entrada
      return false; 
    }
  }

  console.log('✅ PASE AUTORIZADO. Bienvenido.');
  return true; 
};