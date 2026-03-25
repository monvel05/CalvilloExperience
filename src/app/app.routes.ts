import { Routes } from '@angular/router';
// 1. Importamos el guardia que acabas de crear (revisa que el nombre del archivo coincida)
import { authGuard } from './core/guards/auth-guard'; 

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home.page').then((m) => m.HomePage),
    canActivate: [authGuard],
    data: { roles: ['admin'] } // <-- Verifica que esta línea esté aquí

  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'registrarse',
    loadComponent: () => import('./pages/registrarse/registrarse.page').then( m => m.RegistrarsePage)
  },
  {
    path: 'administrador-inicio',
    loadComponent: () => import('./pages/administrador-inicio/administrador-inicio.page').then( m => m.AdministradorInicioPage)
  },
  {
    path: 'turista-inicio',
    loadComponent: () => import('./pages/turista-inicio/turista-inicio.page').then( m => m.TuristaInicioPage)
  },
  {
    path: 'negocio-inicio',
    loadComponent: () => import('./pages/negocio-inicio/negocio-inicio.page').then( m => m.NegocioInicioPage)
  },
  {
    path: 'mapa',
    loadComponent: () => import('./pages/mapa/mapa.page').then( m => m.MapaPage)
  },
  {
    path: 'muro-social',
    loadComponent: () => import('./pages/muro-social/muro-social.page').then( m => m.MuroSocial)
  },
  {
    path: 'info-negocio',
    loadComponent: () => import('./pages/info-negocio/info-negocio.page').then( m => m.InfoNegocioPage)
  },{
    path: "**",
    redirectTo: "home",
    pathMatch: "full"
  },
  {
    path: 'reservar',
    loadComponent: () => import('./pages/reservar/reservar.page').then( m => m.ReservarPage)
  },


];
  


