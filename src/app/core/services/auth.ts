import { Injectable, inject } from '@angular/core'; // Usamos inject para consistencia con Angular 20
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
  // Inyección moderna de dependencias
  private http = inject(HttpClient);
  private router = inject(Router);

  login(correo: string, contraseña: string): Observable<any> {
    // Apuntamos a /api/login
    return this.http.post(`${environment.apiUrl}/api/login`, { correo, contraseña }).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }
      })
    );
  }

  registrarUsuario(datos: RegistroUsuario): Observable<any> {
    // CORRECCIÓN: Añadimos /api/ para que coincida con el servidor de Express
    return this.http.post(`${environment.apiUrl}/api/usuarios`, datos);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  getUser(): DatosUsuario | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) as DatosUsuario : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}