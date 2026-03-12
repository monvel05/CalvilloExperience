import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    //canActivate: [authGuard]     GUARD DESACTIVADO!!!!!!!----------------------------
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
];