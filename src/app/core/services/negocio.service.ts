import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/env'; // Ajusta la ruta según la ubicación de tu archivo env

@Injectable({
  providedIn: 'root'
})
export class NegocioService {
  // Inyección moderna de dependencias
  private http = inject(HttpClient);
  
  // Apuntamos al endpoint que acabamos de crear en Express
  private apiUrl = `${environment.apiUrl}/negocios`;

  /**
   * Obtiene todos los negocios con sus subcategorías (Ideal para turista-inicio)
   * Nota: El language.interceptor ya se encarga de mandar el idioma correcto en el header
   */
  obtenerTodos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  /**
   * Obtiene los datos de un negocio específico (Ideal para info-negocio)
   */
  obtenerPorId(id: number | string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  /**
   * Obtiene los negocios optimizados para los pines del mapa (Ideal para el componente mapa)
   */
  obtenerParaMapa(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mapa`);
  }

  // Si el usuario con rol de Negocio o Administrador necesita crear/editar:
  crearNegocio(datosNegocio: any): Observable<any> {
    return this.http.post(this.apiUrl, datosNegocio);
  }

  actualizarNegocio(id: number | string, datosNegocio: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, datosNegocio);
  }

  eliminarNegocio(id: number | string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}