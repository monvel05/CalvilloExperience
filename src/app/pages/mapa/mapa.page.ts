import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonButton, IonCard, IonCardContent, IonIcon, IonSegment, IonLabel, IonSegmentButton, IonFooter, IonTabBar, IonTabButton } from '@ionic/angular/standalone';
import { PuntoInteres } from 'src/app/shared/interfaces/punto-interes';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../../env/env';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, location, heartOutline, personOutline, imageOutline, imagesOutline, calendarOutline } from 'ionicons/icons';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [IonSegment, IonIcon, 
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
    GoogleMapsModule,
    IonSegmentButton,
    IonLabel,
    IonFooter,
    IonTabBar,
    IonTabButton
    ]
})

export class MapaPage implements OnInit {

  constructor(private router: Router) { 
    addIcons({imageOutline,homeOutline,location,calendarOutline,imagesOutline,personOutline,heartOutline});
  }

  // Cambiamos el tipo a 'any' temporalmente para evitar que la app truene antes de cargar el script
  center: any = { lat: 21.8469, lng: -102.7184 };
  zoom = 14;

  // Control del modal
  modalAbierto = false;

  // Signal para almacenar la lista de lugares
  lugares = signal<PuntoInteres[]>([]);

  // Lugar seleccionado
  lugarSeleccionado = signal<PuntoInteres | null>(null);

  ngOnInit() {
    this.cargarGoogleMaps();
    this.cargarDatosSimulados();
  }

  // 2. Función para cargar el mapa dinámicamente
  cargarGoogleMaps() {
    // Si 'google' ya existe en la ventana, no hacemos nada
    if (typeof google !== 'undefined') {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.apis.mapsApiKey}`;
    script.async = true;
    script.defer = true;
    
    // Cuando el script termine de cargar, podemos re-asignar el centro si es necesario
    script.onload = () => {
      console.log('Google Maps SDK cargado correctamente');
    };

    document.head.appendChild(script);
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

  irAMuroSocial() {
    this.router.navigate(['/muro-social']); 
  }
}
