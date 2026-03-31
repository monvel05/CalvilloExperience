import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MuroSocialService {

  private API = 'http://localhost:3000/api/publicaciones';

  constructor() {}

  // Obtener publicaciones
  async getPublicaciones() {
    const res = await fetch(this.API);
    return await res.json();
  }

  // Dar like
  async darLike(id: number, idUsuario: number) {
    return await fetch(`${this.API}/${id}/like`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idUsuario })
    });
  }

  // Eliminar publicación
  async eliminarPublicacion(id: number) {
    return await fetch(`${this.API}/${id}`, {
      method: 'DELETE'
    });
  }

  // Crear publicación
  async crearPublicacion(data: any) {
    return await fetch(this.API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }
}