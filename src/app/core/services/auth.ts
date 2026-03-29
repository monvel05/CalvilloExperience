import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/env';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';

// Interfaz exclusiva para el registro, añade la contraseña que no está en DatosUsuario
export interface RegistroUsuario extends Omit<DatosUsuario, 'idUsuario'> {
  contraseña: string; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private http: HttpClient) { }

  login(correo: string, contraseña: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/api/login`, { correo, contraseña }).pipe(
      tap((res: any) => {
        // Guardar el token y datos en el navegador
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
      })
    );
  }

  registrarUsuario(datos: RegistroUsuario): Observable<any> {
    // Aseguramos que el backend reciba la propiedad 'contraseña' con 'ñ'
    const bodyEnvio = {
      ...datos,
      contraseña: datos.contraseña 
    };
    return this.http.post(`${environment.apiUrl}/usuarios`, bodyEnvio);
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
    this.router.navigate(['/login']); // Redirige al inicio de sesión
  }
}