import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonButton, IonCard, IonCardContent } from '@ionic/angular/standalone';
import { PuntoInteres } from 'src/app/interfaces/punto-interes';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonModal,
    IonButton,
    IonCard,
    IonCardContent,
    CommonModule,
    FormsModule,
    GoogleMapsModule
  ]
})
export class MapaPage implements OnInit {

  constructor() { }

  center: google.maps.LatLngLiteral = { lat: 21.8469, lng: -102.7184 };
  zoom = 14;

  // Control del modal
  modalAbierto = false;

  // Signal para almacenar la lista de lugares
  lugares = signal<PuntoInteres[]>([]);

  // Lugar seleccionado
  lugarSeleccionado = signal<PuntoInteres | null>(null);

  ngOnInit() {
    this.cargarDatosSimulados();
  }

  cargarDatosSimulados() {
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

  // Cuando el usuario toca un marcador
  onMarcadorClick(lugar: PuntoInteres) {

    this.lugarSeleccionado.set(lugar);

    // Abrir el modal
    this.modalAbierto = true;

    console.log('El usuario seleccionó:', lugar.nombre);
  }

  // Cerrar modal
  cerrarModal() {
    this.modalAbierto = false;
  }

}
