import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // 1. Obtenemos el token y el objeto del usuario que guardó tu compañero
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user'); 

  // 2. Si falta alguno de los dos, lo mandamos al login directo
  if (!token || !userString) {
    console.warn('Acceso denegado: Necesitas iniciar sesión.');
    router.navigate(['/login']);
    return false;
  }

  // 3. "Desempaquetamos" el texto para convertirlo en un objeto real de JavaScript
  let user;
  try {
    user = JSON.parse(userString);
  } catch (error) {
    console.error('Error al leer los datos del usuario. Sesión corrupta.');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.navigate(['/login']);
    return false;
  }

  // 4. Extraemos el número mágico (1 = Admin, 2 = Turista, 3 = Negocio)
  const userRole = user.rol; 

  // 5. Revisamos qué roles (números) exige la ruta que quiere visitar
  const requiredRoles = route.data?.['roles'] as Array<number>;

  // 6. Si la ruta SÍ exige roles, verificamos que el usuario tenga el número correcto
  if (requiredRoles && requiredRoles.length > 0) {
    if (!requiredRoles.includes(userRole)) {
      console.warn(`BLOQUEADO: Tienes el rol ${userRole} y la ruta exige ${requiredRoles}`);
      
      // Si un intruso quiere entrar, lo mandamos a su pantalla de inicio correspondiente
      switch (userRole) {
        case 1: router.navigate(['/administrador-inicio']); break;
        case 2: router.navigate(['/turista-inicio']); break;
        case 3: router.navigate(['/negocio-inicio']); break;
        default: router.navigate(['/login']); break;
      }
      return false; 
    }
  }

  // 7. Si pasó todas las pruebas, lo dejamos pasar
  return true; 
};