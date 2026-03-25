import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/env';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/usuarios`; 

  /**
   * Obtiene el perfil de un usuario específico.
   * Método: GET
   */
  obtenerUsuario(idUsuario: number): Observable<DatosUsuario> {
    return this.http.get<DatosUsuario>(`${this.apiUrl}/${idUsuario}`);
  }

  /**
   * Actualiza los datos del perfil de un usuario.
   * Usamos Partial<DatosUsuario> para permitir enviar solo los campos que cambiaron.
   * Método: PUT
   */
  actualizarPerfil(idUsuario: number, datosActualizados: Partial<DatosUsuario>): Observable<any> {
    return this.http.put(`${this.apiUrl}/${idUsuario}`, datosActualizados);
  }

  /**
   * Elimina la cuenta de un usuario (Baja lógica o física según tu BD).
   * Método: DELETE
   */
  eliminarCuenta(idUsuario: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${idUsuario}`);
  }
}