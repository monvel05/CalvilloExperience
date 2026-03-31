import { Component, OnInit, signal, computed, NgZone, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonToolbar, IonModal, IonButton, IonIcon,
  IonSegment, IonLabel, IonSegmentButton, IonFooter, IonTabBar, IonTabButton,
  ToastController
} from '@ionic/angular/standalone';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../../env/env';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  homeOutline, location, personOutline, imageOutline,
  imagesOutline, calendarOutline, call, locationOutline, callOutline
} from 'ionicons/icons';

// Importamos el servicio correcto
import { NegocioService } from 'src/app/core/services/negocio.service';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [
    IonSegment, IonIcon, IonContent, IonHeader, IonToolbar,
    IonModal, IonButton, CommonModule, FormsModule,
    GoogleMapsModule, IonSegmentButton, IonLabel,
    IonFooter, IonTabBar, IonTabButton, TranslateModule
  ]
})
export class MapaPage implements OnInit {

  // Inyección moderna
  private router = inject(Router);
  private negocioService = inject(NegocioService);
  private ngZone = inject(NgZone);
  private translate = inject(TranslateService);
  private toastCtrl = inject(ToastController);

  // Coordenadas centrales de Calvillo
  center: any = { lat: 21.8469, lng: -102.7184 };
  zoom = 14;
  modalAbierto = false;

  // Uso excelente de Signals (Angular 20)
  lugares = signal<any[]>([]);
  lugarSeleccionado = signal<any | null>(null);
  categoriaSeleccionada = signal<string>('Atractivo turistico'); // Ajustado a los nombres de tu BD

  // Computado que se actualiza mágicamente al cambiar la categoría
  lugaresFiltrados = computed(() => {
    return this.lugares().filter(
      lugar => lugar.categoria?.toLowerCase() === this.categoriaSeleccionada().toLowerCase()
    );
  });

  constructor() {
    addIcons({
      locationOutline, callOutline, homeOutline, location,
      calendarOutline, imagesOutline, personOutline, call, imageOutline
    });
  }

  ngOnInit() {
    // Configuración Bilingüe
    const usuarioStr = localStorage.getItem('user');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr) as DatosUsuario;
      this.translate.use(usuario.idIdioma === 2 ? 'en' : 'es');
    }

    this.cargarGoogleMaps();
  }

  ionViewWillEnter() {
    this.cargarLugaresDesdeBD();
  }

  // Carga segura del script para evitar duplicados en el DOM
  cargarGoogleMaps() {
    if (typeof google !== 'undefined') return;
    if (document.getElementById('google-maps-script')) return;

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.apis.mapsApiKey}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  cargarLugaresDesdeBD() {
    // Usamos el servicio unificado que conectamos a Express
    this.negocioService.obtenerTodos().subscribe({
      next: (data) => {
        const lugaresMapeados = data.map((negocio: any) => {
          const lat = parseFloat(negocio.latitud || negocio.ubicacion?.latitud);
          const lng = parseFloat(negocio.longitud || negocio.ubicacion?.longitud);

          if (isNaN(lat) || isNaN(lng)) return null;

          // Asignamos pines de colores oficiales de Google Maps
          let iconUrl = 'http://maps.google.com/mapfiles/ms/icons/red-dot.png';
          const cat = negocio.categoria?.toLowerCase() || '';
          
          if (cat.includes('atractivo')) iconUrl = 'http://maps.google.com/mapfiles/ms/icons/purple-dot.png';
          else if (cat.includes('restaurante') || cat.includes('cenaduria')) iconUrl = 'http://maps.google.com/mapfiles/ms/icons/orange-dot.png';
          else if (cat.includes('hospedaje') || cat.includes('hotel')) iconUrl = 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png';
          else if (cat.includes('transporte')) iconUrl = 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png';

          return {
            id: negocio.idNegocio,
            nombre: negocio.nombre,
            categoria: negocio.categoria,
            coordenadas: { lat, lng },
            markerOptions: {
              icon: { url: iconUrl },
              title: negocio.nombre
            },
            direccion: negocio.ubicacion?.direccionCompleta || 'Dirección no disponible',
            telefono: negocio.telefono || 'Sin teléfono'
          };
        }).filter((l: any) => l !== null);

        this.lugares.set(lugaresMapeados);
      },
      error: (err) => console.error('Error al cargar pines del mapa:', err)
    });
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
    // Opcional: limpiar la selección tras cerrar
    setTimeout(() => this.lugarSeleccionado.set(null), 300);
  }

  verDetalles(idNegocio: number) {
    this.cerrarModal();
    this.ngZone.run(() => {
      this.router.navigate([`/info-negocio/${idNegocio}`]);
    });
  }

  navegar(ruta: string) {
    this.ngZone.run(() => {
      this.router.navigate([`/${ruta}`], { replaceUrl: true });
    });
  }

  async irAReservas() {
    // UX: Como Reservar requiere un ID de negocio, mostramos un aviso
    const toast = await this.toastCtrl.create({
      message: this.translate.instant('MAP_PAGE.RESERVE_WARNING'),
      duration: 3000,
      color: 'warning',
      position: 'top'
    });
    toast.present();
    this.navegar('turista-inicio');
  }

  irComoLlegar(lugar: any) {
    if (!lugar) return;
    const destinoLat = lugar.coordenadas.lat;
    const destinoLng = lugar.coordenadas.lng;

    // Link oficial universal de Google Maps
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destinoLat},${destinoLng}&travelmode=driving`;
    window.open(url, '_system'); // _system asegura que abra en la app nativa si están en celular
  }
}