import { Injectable } from '@angular/core';
import { Geolocation } from '@capacitor/geolocation';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService {

  constructor() { }

  async obtenerUbicacionActual() {
    const coordinates = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true
    });
    
    return {
      lat: coordinates.coords.latitude,
      lng: coordinates.coords.longitude
    };
  }

  async vigilarUbicacion(callback: (pos: {lat: number, lng: number}) => void): Promise<string> {
    return Geolocation.watchPosition({
      enableHighAccuracy: true
    }, (position, err) => {
      if (err) {
        console.error('Error en watchPosition:', err);
        return;
      }

      if (!position || !position.coords) {
        console.warn('watchPosition devolvió posición inválida:', position);
        return;
      }

      callback({
        lat: position.coords.latitude,
        lng: position.coords.longitude
      });
    });
  }

  async detenerVigilancia(watchId?: string): Promise<void> {
    if (!watchId) {
      return;
    }

    try {
      await Geolocation.clearWatch({ id: watchId });
    } catch (error) {
      console.error('Error deteniendo vigilancia de ubicación:', error);
    }
  }
}