import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/env';

@Injectable({ 
  providedIn: 'root' 
})
export class TrackingService {
  private http = inject(HttpClient);
  // Asegúrate de cambiar esto por la URL base de tu API en Express
  private apiUrl = environment.apiUrl + '/logs'; 

  /**
   * Envía un evento al backend de forma silenciosa
   * @param tipoEvento El nombre estándar del evento (ej. 'BUSQUEDA', 'PAGE_VIEW')
   * @param detalles Objeto JSON opcional con el contexto del evento
   */
  registrarEvento(tipoEvento: string, detalles: any = null) {
    // Intentamos obtener el ID del usuario si ya inició sesión
    // (Asumiendo que guardan el ID del turista o del negocio en el localStorage)
    const idUsuarioStr = localStorage.getItem('idUsuario');
    const idUsuario = idUsuarioStr ? parseInt(idUsuarioStr, 10) : null;
    
    // Identificamos desde dónde navega
    const plataforma = 'Web / PWA Ionic';

    const payload = {
      idUsuario,
      tipoEvento,
      detalles,
      plataforma
    };

    // Hacemos la petición POST. 
    // Nota: Nos suscribimos pero no bloqueamos la UI. Es una operación "fire and forget".
    this.http.post(this.apiUrl, payload).subscribe({
      // Opcional: Solo mostramos error en consola si falla, para no molestar al usuario
      error: (err) => console.error('Error enviando log de telemetría:', err)
    });
  }
}