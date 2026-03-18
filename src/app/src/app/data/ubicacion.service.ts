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

  async vigilarUbicacion(callback: (pos: {lat: number, lng: number}) => void) {
    return await Geolocation.watchPosition({
      enableHighAccuracy: true
    }, (position) => {
      if (position) {
        callback({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      }
    });
  }
}