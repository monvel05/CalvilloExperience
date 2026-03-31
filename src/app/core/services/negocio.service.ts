import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/env';
import { Observable } from 'rxjs';
import { DatosNegocio } from '../../shared/interfaces/datos-negocio';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {
  // Inyectamos HttpClient de forma moderna
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/negocios`;

  constructor() { }

  /**
   * Obtiene la lista completa de negocios desde Express
   */
  obtenerTodos(): Observable<DatosNegocio[]> {
    return this.http.get<DatosNegocio[]>(this.apiUrl);
  }

  /**
   * Obtiene un solo negocio por su ID
   */
  obtenerPorId(id: number | string): Observable<DatosNegocio> {
    return this.http.get<DatosNegocio>(`${this.apiUrl}/${id}`);
  }

  /**
   *  Obtener negocios por categoría
   */
  obtenerPorCategoria(categoria: string): Observable<DatosNegocio[]> {
    return this.http.get<DatosNegocio[]>(`${this.apiUrl}/categoria/${categoria}`);
  }
}