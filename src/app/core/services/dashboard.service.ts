import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/env'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  
  // Inyección moderna
  private http = inject(HttpClient);
  
  // Usamos el environment para que sea dinámico
  private API = `${environment.apiUrl}/dashboard`;

  getGanancias(): Observable<any> {
    return this.http.get<any>(`${this.API}/ganancias`);
  }

  getMembresias(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/membresias`);
  }

  getGananciasMensuales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/ganancias-mensuales`);
  }

  getUsuarios(): Observable<any> {
    return this.http.get<any>(`${this.API}/usuarios`);
  }

  getTuristas(): Observable<any> {
    return this.http.get<any>(`${this.API}/turistas`);
  }

  getNegocios(): Observable<any> {
    return this.http.get<any>(`${this.API}/negocios`);
  }

  getGeneros(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/generos`);
  }

  getListaNegocios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.API}/lista-negocios`);
  }
}