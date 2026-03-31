import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/env/env';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  
  // Inyección moderna
  private http = inject(HttpClient);
  
  // Usamos la variable de entorno para que sea dinámico
  private apiUrl = `${environment.apiUrl}/reservas`;

  enviarReserva(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }
}