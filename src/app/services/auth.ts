import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../env/env';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router,private http: HttpClient) { }

  // Se mantiene igual: Gestiona el acceso y guarda datos en el navegador
  login(correo: string, contraseña: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/login`, { correo, contraseña }).pipe(
      tap((res: any) => {
        //Guardar el token y datos en el navegador
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

 
  // Se mantiene igual: Envía el objeto "datos" al endpoint de usuarios
  registrarUsuario(datos: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/usuarios`, datos);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Recupera el objeto del usuario logueado (útil para mostrar el nombre en el Home)
   */
  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
   * Obtiene solo el token para interceptores o peticiones manuales
   */
  getToken() {
    return localStorage.getItem('token');
  }
}