import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/env/env';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocalizacionService { 
  
  private http = inject(HttpClient);
  
  private apiUrl = `${environment.apiUrl}/lugares`; 

  getLugares(categoria: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${categoria}`);
  }

  predecirPosicion(pos: {lat: number, lng: number}, v: number, rumbo: number, t: number = 1) {
    const rad = (rumbo * Math.PI) / 180;
    
    // Cálculos de predicción física
    const deltaLat = (v * Math.cos(rad) * t) / 111111;
    const deltaLng = (v * Math.sin(rad) * t) / (111111 * Math.cos(pos.lat * Math.PI / 180));

    return {
      lat: pos.lat + deltaLat,
      lng: pos.lng + deltaLng
    };
  }
}