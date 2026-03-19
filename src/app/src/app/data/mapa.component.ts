import { Component, OnInit } from '@angular/core';
import { UbicacionService } from './ubicacion.service';
import { Lugar } from './lugar.interface'; 
import { ATRACTIVOS } from './atractivos';
import { CENADURIAS } from './cenadurias';
import { COMIDA_RAPIDA } from './comida_rapida';
import { HOSPEDAJE } from './hospedaje';
import { TRANSPORTE } from './transporte';

declare var H: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html'
})
export class MapaComponent implements OnInit {
  map: any;
  userMarker: any;
  lugaresActuales: Lugar[] = [];

  constructor(private ubicacionService: UbicacionService) {}

  async ngOnInit() {
    const pos = await this.ubicacionService.obtenerUbicacionActual();
    this.initMap(pos);
    
    this.ubicacionService.vigilarUbicacion((nuevaPos) => {
      this.actualizarMarcadorUsuario(nuevaPos);

      // --- TAREA RH-8 (PREDICCIÓN CON ED) ---
      // v = velocidad constante, t = tiempo en segundos
      const v = 1.4; // velocidad promedio caminar
      const t = 5;   // predecir a 5 segundos
      const rad = (0 * Math.PI) / 180; // Rumbo norte por defecto
      
      const deltaLat = (v * Math.cos(rad) * t) / 111111;
      const deltaLng = (v * Math.sin(rad) * t) / (111111 * Math.cos(nuevaPos.lat * Math.PI / 180));
      
      console.log('RH-8 Predicción:', { lat: nuevaPos.lat + deltaLat, lng: nuevaPos.lng + deltaLng });
      // --------------------------------------
    });
  }

  initMap(pos: {lat: number, lng: number}) {
    const platform = new H.service.Platform({
      apikey: 'TU_API_KEY_AQUI' 
    });
    const defaultLayers = platform.createDefaultLayers();

    this.map = new H.Map(
      document.getElementById('mapContainer'),
      defaultLayers.vector.normal.map,
      {
        center: pos,
        zoom: 15,
        pixelRatio: window.devicePixelRatio || 1
      }
    );

    new H.mapevents.Behavior(new H.mapevents.MapEvents(this.map));
    H.ui.UI.createDefault(this.map, defaultLayers);
    this.actualizarMarcadorUsuario(pos);
  }

  actualizarMarcadorUsuario(pos: {lat: number, lng: number}) {
    if (this.userMarker) this.map.removeObject(this.userMarker);
    this.userMarker = new H.map.Marker(pos);
    this.map.addObject(this.userMarker);
  }

  cambiarCategoria(event: any) {
    const seleccion = event.target.value;
    if (this.map) {
      this.map.getObjects().forEach((obj: any) => {
        if (obj instanceof H.map.Marker && obj !== this.userMarker) this.map.removeObject(obj);
      });
    }

    // Regresamos a los archivos locales para que no haya errores de MySQL
    if (seleccion === 'comida') this.lugaresActuales = COMIDA_RAPIDA;
    else if (seleccion === 'turismo') this.lugaresActuales = ATRACTIVOS;
    else if (seleccion === 'hospedaje') this.lugaresActuales = HOSPEDAJE;
    else if (seleccion === 'transporte') this.lugaresActuales = TRANSPORTE;
    else if (seleccion === 'cenadurias') this.lugaresActuales = CENADURIAS;

    this.lugaresActuales.forEach(lugar => {
      const marker = new H.map.Marker(lugar.coords);
      marker.addEventListener('tap', () => this.calcularRuta(lugar.coords));
      this.map.addObject(marker);
    });
  }

  calcularRuta(destino: {lat: number, lng: number}) {
    const router = new H.service.RoutingService8({ apikey: 'TU_API_KEY_AQUI' });
    const params = {
      routingMode: 'fast',
      transportMode: 'car',
      origin: `${this.userMarker.getGeometry().lat},${this.userMarker.getGeometry().lng}`,
      destination: `${destino.lat},${destino.lng}`,
      return: 'polyline,summary'
    };

    router.calculateRoute(params, (result: any) => {
      if (result.routes.length) {
        const section = result.routes[0].sections[0];
        const linestring = H.geo.LineString.fromFlexiblePolyline(section.polyline);
        const routeLine = new H.map.Polyline(linestring, { style: { strokeColor: 'blue', lineWidth: 5 } });
        this.map.removeObjects(this.map.getObjects().filter((obj: any) => obj instanceof H.map.Polyline));
        this.map.addObject(routeLine);
      }
    }, (error: any) => console.error(error));
  }
}