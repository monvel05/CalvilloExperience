import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private API = 'http://localhost:3000/api/dashboard';

  constructor(private http: HttpClient) {}

  // Función auxiliar para adjuntar el filtro a la URL si existe
  private getOptions(filtro?: string) {
    let params = new HttpParams();
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    return { params };
  }

  getGanancias(filtro?: string) {
    return this.http.get<any>(`${this.API}/ganancias`, this.getOptions(filtro));
  }

  getMembresias(filtro?: string) {
    return this.http.get<any>(`${this.API}/membresias`, this.getOptions(filtro));
  }

  getGananciasMensuales(filtro?: string) {
    return this.http.get<any>(`${this.API}/ganancias-mensuales`, this.getOptions(filtro));
  }

  getUsuarios(filtro?: string) {
    return this.http.get<any>(`${this.API}/usuarios`, this.getOptions(filtro));
  }

  getTuristas(filtro?: string) {
    return this.http.get<any>(`${this.API}/turistas`, this.getOptions(filtro));
  }

  getNegocios(filtro?: string) {
    return this.http.get<any>(`${this.API}/negocios`, this.getOptions(filtro));
  }

  getGeneros(filtro?: string) {
    return this.http.get<any>(`${this.API}/generos`, this.getOptions(filtro));
  }

  getListaNegocios(filtro?: string) {
    return this.http.get<any[]>(`${this.API}/lista-negocios`, this.getOptions(filtro));
  }
}