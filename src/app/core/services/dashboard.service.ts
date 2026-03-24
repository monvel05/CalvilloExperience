import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private API = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  getGanancias() {
    return this.http.get<any>(`${this.API}/ganancias`);
  }

  getMembresias() {
    return this.http.get<any>(`${this.API}/membresias`);
  }

  getGananciasMensuales() {
    return this.http.get<any>(`${this.API}/ganancias-mensuales`);
  }

  getUsuarios() {
    return this.http.get<any>(`${this.API}/usuarios`);
  }

  getTuristas() {
    return this.http.get<any>(`${this.API}/turistas`);
  }

  getNegocios() {
    return this.http.get<any>(`${this.API}/negocios`);
  }
  getGeneros() {
    return this.http.get<any>(`${this.API}/generos`);
  }
  getListaNegocios() {
    return this.http.get<any[]>(`${this.API}/lista-negocios`);
  }
}