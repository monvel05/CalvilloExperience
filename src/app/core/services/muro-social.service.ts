import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MuroSocialService {
  // Inyección moderna
  private http = inject(HttpClient);
  
  // URL dinámica
  private API = `${environment.apiUrl}/publicaciones`;

  // Obtener publicaciones
  getPublicaciones(): Observable<any[]> {
    return this.http.get<any[]>(this.API);
  }

  // Dar like
  darLike(id: number, idUsuario: number): Observable<any> {
    return this.http.post(`${this.API}/${id}/like`, { idUsuario });
  }

  // Eliminar publicación
  eliminarPublicacion(id: number): Observable<any> {
    return this.http.delete(`${this.API}/${id}`);
  }

  // Crear publicación
  crearPublicacion(data: any): Observable<any> {
    return this.http.post(this.API, data);
  }
}