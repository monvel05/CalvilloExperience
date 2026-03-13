import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { PuntoInteres } from 'src/app/interfaces/punto-interes';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class MapaPage implements OnInit {

  constructor() { }

  center: google.maps.LatLngLiteral = { lat: 21.8469, lng: -102.7184 };
  zoom = 14;

  // Signal para almacenar la lista de lugares en Calvillo
  lugares = signal<PuntoInteres[]>([]);
  
  // Signal para saber qué marcador se tocó (útil para la UI)
  lugarSeleccionado = signal<PuntoInteres | null>(null);

  ngOnInit() {
    this.cargarDatosSimulados();
  }

  cargarDatosSimulados() {
    // Datos de prueba mientras el backend está listo
    this.lugares.set([
      { 
        id: 1, 
        nombre: 'Museo Nacional de los Pueblos Mágicos', 
        categoria: 'museo', 
        coordenadas: { lat: 21.8465, lng: -102.7190 }, 
        iconoUrl: 'assets/icons/museo.svg' 
      },
      { 
        id: 2, 
        nombre: 'Presa de Malpaso', 
        categoria: 'presa', 
        coordenadas: { lat: 21.8600, lng: -102.6500 }, 
        iconoUrl: 'assets/icons/presa.svg' 
      }
    ]);
  }

     // Método que se ejecuta al hacer clic en un marcador
  onMarcadorClick(lugar: PuntoInteres) {
    // Actualizamos el Signal. La UI reaccionará automáticamente.
    this.lugarSeleccionado.set(lugar);
    console.log('El usuario seleccionó:', lugar.nombre);
  }
}


