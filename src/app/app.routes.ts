import { Routes } from '@angular/router';

// 1. Importamos el guardia apuntando a tu nueva carpeta 'guards'
import { authGuard } from './guards/auth-guard'; 

export const routes: Routes = [
  // RUTAS PÚBLICAS (Cualquiera puede entrar)
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registrarse',
    loadComponent: () => import('./pages/registrarse/registrarse.page').then( m => m.RegistrarsePage)
  },
  {
    path: 'home',
loadComponent: () => import('./pages/home/home.page').then( m => m.HomePage)  },

  // RUTAS PRIVADAS (Protegidas por el Guardia)
  {
    path: 'administrador-inicio',
    loadComponent: () => import('./pages/administrador-inicio/administrador-inicio.page').then( m => m.AdministradorInicioPage),
    canActivate: [authGuard],
    data: { roles: [1] } // 👈 Solo Rol 1 (Admin)
  },
  {
    path: 'turista-inicio',
    loadComponent: () => import('./pages/turista-inicio/turista-inicio.page').then( m => m.TuristaInicioPage),
    canActivate: [authGuard],
    data: { roles: [2] } // 👈 Solo Rol 2 (Turista)
  },
  {
    path: 'negocio-inicio',
    loadComponent: () => import('./pages/negocio-inicio/negocio-inicio.page').then( m => m.NegocioInicioPage),
    canActivate: [authGuard],
    data: { roles: [3] } // 👈 Solo Rol 3 (Negocio)
  },
  {
    path: 'mapa',
    loadComponent: () => import('./pages/mapa/mapa.page').then( m => m.MapaPage),
    canActivate: [authGuard],
    data: { roles: [1, 2, 3] } // 👈 Ejemplo: Todos los usuarios logueados pueden ver el mapa
  },
  {
    path: 'muro-social',
    loadComponent: () => import('./pages/muro-social/muro-social.page').then( m => m.MuroSocial)
  },
  {
    path: 'info-negocio',
    loadComponent: () => import('./pages/info-negocio/info-negocio.page').then( m => m.InfoNegocioPage)
  },
  {
    path: 'reservar',
    loadComponent: () => import('./pages/reservar/reservar.page').then( m => m.ReservarPage)
  },
  {
    path: "**",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: 'turista-perfil',
    loadComponent: () => import('./pages/turista-perfil/turista-perfil.page').then( m => m.TuristaPerfilPage)
  }, 

  // RUTA POR DEFECTO
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];
