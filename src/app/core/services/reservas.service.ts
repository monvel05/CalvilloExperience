import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  
  private apiUrl = 'http://localhost:3000/reservas';

  constructor(private http: HttpClient) {}

  enviarReserva(datos: any): Observable<any> {
    return this.http.post(this.apiUrl, datos);
  }
}