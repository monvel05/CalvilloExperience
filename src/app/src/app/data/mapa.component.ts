import { Component, OnInit } from '@angular/core';
import { UbicacionService } from './ubicacion.service'; 
import { Lugar } from './lugar.interface';

declare var H: any;

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html'
})
export class MapaComponent implements OnInit {
  map: any;
  platform: any; 
  userMarker: any;
  lugaresActuales: Lugar[] = []; 

  constructor(private ubicacionService: UbicacionService) {}

  async ngOnInit() {
    const pos = await this.ubicacionService.obtenerUbicacionActual();
    this.initMap(pos);
    
    this.ubicacionService.vigilarUbicacion((nuevaPos: any) => {
      this.actualizarMarcadorUsuario(nuevaPos);

      // Algoritmo RH-8
      const v = 1.4; 
      const t = 5;   
      const rad = (0 * Math.PI) / 180; 
      
      const deltaLat = (v * Math.cos(rad) * t) / 111111;
      const deltaLng = (v * Math.sin(rad) * t) / (111111 * Math.cos(nuevaPos.lat * Math.PI / 180));
      
      console.log('RH-8 Predicción a 5s:', { 
        lat: nuevaPos.lat + deltaLat, 
        lng: nuevaPos.lng + deltaLng 
      });
    });
  }

  initMap(pos: {lat: number, lng: number}) {
    this.platform = new H.service.Platform({
      apikey: 'TU_API_KEY_AQUI' 
    });
    
    const defaultLayers = this.platform.createDefaultLayers();

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
        if (obj instanceof H.map.Marker && obj !== this.userMarker) {
          this.map.removeObject(obj);
        }
      });
    }

    if (!seleccion) return;

    const service = this.platform.getSearchService();
    
    service.discover({
      at: `${this.userMarker.getGeometry().lat},${this.userMarker.getGeometry().lng}`,
      q: `${seleccion} en Calvillo` 
    }, (result: any) => {
      this.lugaresActuales = result.items; 

      this.lugaresActuales.forEach((lugar: any) => {
        const marker = new H.map.Marker(lugar.position);
        
        marker.addEventListener('tap', () => {
          this.calcularRuta(lugar.position);
        });

        this.map.addObject(marker);
      });
    }, (error: any) => console.error('Error en búsqueda:', error));
  }

  calcularRuta(destino: {lat: number, lng: number}) {
    const router = this.platform.getRoutingService8(); 
    
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
        const routeLine = new H.map.Polyline(linestring, { 
          style: { strokeColor: 'blue', lineWidth: 5 } 
        });
        
        this.map.removeObjects(this.map.getObjects().filter((obj: any) => obj instanceof H.map.Polyline));
        this.map.addObject(routeLine);
      }
    }, (error: any) => console.error('Error de ruta:', error));
  }
}