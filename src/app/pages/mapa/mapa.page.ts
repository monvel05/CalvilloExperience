import { Component, OnInit, signal, computed, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonModal, IonButton, IonIcon,
  IonSegment, IonLabel, IonSegmentButton, IonFooter, IonTabBar, IonTabButton
} from '@ionic/angular/standalone';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../../env/env';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  homeOutline, location, personOutline, imageOutline,
  imagesOutline, calendarOutline, call, locationOutline, callOutline
} from 'ionicons/icons';
import { MapaService } from 'src/app/core/services/mapa.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [
    IonSegment, IonIcon, IonContent, IonHeader, IonToolbar,
    IonModal, IonButton, CommonModule, FormsModule,
    GoogleMapsModule, IonSegmentButton, IonLabel,
    IonFooter, IonTabBar, IonTabButton
  ]
})
export class MapaPage implements OnInit {

  constructor(
    private router: Router,
    private mapaService: MapaService,
    private ngZone: NgZone
  ) {
    addIcons({
      locationOutline, callOutline, homeOutline, location,
      calendarOutline, imagesOutline, personOutline, call, imageOutline
    });
  }

  center: any = { lat: 21.8469, lng: -102.7184 };
  zoom = 14;
  modalAbierto = false;

  lugares = signal<any[]>([]);
  lugarSeleccionado = signal<any | null>(null);
  categoriaSeleccionada = signal<string>('1');

  lugaresFiltrados = computed(() => {
    return this.lugares().filter(
      lugar => lugar.idSubtipo === this.categoriaSeleccionada()
    );
  });

  ngOnInit() {
    this.cargarGoogleMaps();
  }

  ionViewWillEnter() {
    this.cargarLugaresDesdeBD();
  }

  cargarGoogleMaps() {
    if (typeof google !== 'undefined') return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.apis.mapsApiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  async cargarLugaresDesdeBD() {
    try {
      const data = await this.mapaService.obtenerNegociosMapa();

      const lugaresMapeados = data.map((negocio: any) => {
        const lat = parseFloat(negocio.latitud);
        const lng = parseFloat(negocio.longitud);

        if (isNaN(lat) || isNaN(lng)) return null;

        const subtipoId = String(negocio.idSubtipo_Negocio);

        let iconUrl = '';
        switch (subtipoId) {
          case '1':
            iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
            break;
          case '2':
            iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
            break;
          case '3':
            iconUrl = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
            break;
          case '4':
            iconUrl = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';
            break;
          default:
            iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
        }

        return {
          id: negocio.idNegocio,
          nombre: negocio.nombre,
          idSubtipo: subtipoId,
          coordenadas: { lat, lng },
          markerOptions: {
            icon: iconUrl,
            title: negocio.nombre
          },
          direccion: `${negocio.calle} ${negocio.numero}, ${negocio.colonia}`,
          telefono: negocio.telefono || 'Sin teléfono'
        };
      }).filter((l: any) => l !== null);

      this.lugares.set(lugaresMapeados);

    } catch (error) {
      console.error('Error al cargar lugares:', error);
    }
  }

  cambiarCategoria(event: any) {
    this.categoriaSeleccionada.set(event.detail.value);
    this.cerrarModal();
  }

  onMarcadorClick(lugar: any) {
    this.ngZone.run(() => {
      this.lugarSeleccionado.set(lugar);
      this.modalAbierto = true;
    });
  }

  cerrarModal() {
    this.modalAbierto = false;
    this.lugarSeleccionado.set(null);
  }

  navegar(ruta: string) {
    this.ngZone.run(() => {
      this.router.navigate([`/${ruta}`], { replaceUrl: true });
    });
  }

  irAReservas() {
    this.ngZone.run(() => {
      this.router.navigate(['/reservar'], { replaceUrl: true });
    });
  }

  irComoLlegar(lugar: any) {
    if (!lugar) return;

    const destinoLat = lugar.coordenadas.lat;
    const destinoLng = lugar.coordenadas.lng;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${destinoLat},${destinoLng}&travelmode=driving`;

    window.open(url, '_blank');
  }
}