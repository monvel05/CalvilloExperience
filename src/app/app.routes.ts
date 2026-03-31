import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login', 
    pathMatch: 'full',
  },
  {
    // Rutas públicas (Sin guard)
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registrarse',
    loadComponent: () => import('./pages/registrarse/registrarse.page').then(m => m.RegistrarsePage)
  },
  {
    // Home no tiene nada pero por si las moscas
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
    data: { roles: [1, 2, 3] } 
  },
  {
    // ------------------------------------
    // VISTAS EXCLUSIVAS DE ADMINISTRADOR (1)
    // ------------------------------------
    path: 'administrador-inicio',
    loadComponent: () => import('./pages/administrador-inicio/administrador-inicio.page').then(m => m.AdministradorInicioPage),
    canActivate: [authGuard],
    data: { roles: [1] } 
  },
  {
    // ------------------------------------
    // VISTAS DE TURISTAS (2) Y ADMINS (1)
    // ------------------------------------
    path: 'turista-inicio',
    loadComponent: () => import('./pages/turista-inicio/turista-inicio.page').then(m => m.TuristaInicioPage),
    canActivate: [authGuard],
    data: { roles: [1, 2] }
  },
  {
    path: 'info-negocio/:id', // <-- Parámetro dinámico agregado
    loadComponent: () => import('./pages/info-negocio/info-negocio.page').then(m => m.InfoNegocioPage),
    canActivate: [authGuard],
    data: { roles: [1, 2] } 
  },
  {
    path: 'reservar/:id', // <-- Parámetro dinámico agregado
    loadComponent: () => import('./pages/reservar/reservar.page').then(m => m.ReservarPage),
    canActivate: [authGuard],
    data: { roles: [1, 2] } 
  },
  {
    // ------------------------------------
    // VISTAS DE NEGOCIOS (3) Y ADMINS (1)
    // ------------------------------------
    path: 'negocio-inicio',
    loadComponent: () => import('./pages/negocio-inicio/negocio-inicio.page').then(m => m.NegocioInicioPage),
    canActivate: [authGuard],
    data: { roles: [1, 3] }
  },
  {
    path: 'negocio-presentacion',
    loadComponent: () => import('./pages/negocio-presentacion/negocio-presentacion.page').then(m => m.NegocioPresentacionPage),
    canActivate: [authGuard],
    data: { roles: [1, 3] } 
  },
  {
    // ------------------------------------
    // VISTAS COMPARTIDAS (Todos los roles)
    // ------------------------------------
    path: 'mapa',
    loadComponent: () => import('./pages/mapa/mapa.page').then(m => m.MapaPage),
    canActivate: [authGuard],
    data: { roles: [1, 2, 3] }
  },
  {
    path: 'muro-social',
    loadComponent: () => import('./pages/muro-social/muro-social.page').then(m => m.MuroSocial),
    canActivate: [authGuard],
    data: { roles: [1, 2, 3] }
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage),
    canActivate: [authGuard],
    data: { roles: [1, 2, 3] }
  },
  {
    // Ruta comodín: Si escriben una URL que no existe, los mandamos al login
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];