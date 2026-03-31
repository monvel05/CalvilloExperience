import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NegocioService {
  // Ajusta la URL base según tu entorno (ej. environment.apiUrl)
  private apiUrl = 'http://localhost:3000'; 

  constructor() { }

  async obtenerNegocioPorId(id: number | string) {
    try {
      const response = await fetch(`${this.apiUrl}/negocios/${id}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error(`Error al obtener el negocio ${id}:`, error);
      throw error;
    }
  }
}