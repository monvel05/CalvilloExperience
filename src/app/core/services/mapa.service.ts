import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapaService {
  constructor() { }

  async obtenerNegociosMapa() {
    try {
      const response = await fetch("http://localhost:3000/api/negocios-mapa");
      return await response.json();
    } catch (error) {
      console.error("Error en el servicio de mapa:", error);
      throw error;
    }
  }
}