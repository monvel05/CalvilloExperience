import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/env';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';

export interface RegistroUsuario extends Omit<DatosUsuario, 'idUsuario'> {
  contraseña: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyección moderna
  private http = inject(HttpClient);
  private router = inject(Router);

  login(correo: string, contraseña: string): Observable<any> {
    // Nota: Asegúrate de tener la ruta /login en Express (pronto la refactorizaremos)
    return this.http.post(`${environment.apiUrl}/login`, { correo, contraseña }).pipe(
      tap((res: any) => {
        // Usamos 'jwt_token' para que el interceptor lo reconozca
        localStorage.setItem('jwt_token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  registrarUsuario(datos: RegistroUsuario): Observable<any> {
    const bodyEnvio = {
      ...datos,
      contraseña: datos.contraseña 
    };
    return this.http.post(`${environment.apiUrl}/usuarios`, bodyEnvio);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('jwt_token');
  }

  getUser(): DatosUsuario | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) as DatosUsuario : null;
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token');
  }

  logout(): void {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}