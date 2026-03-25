import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonModal, IonButton, IonCard, IonCardContent, IonIcon, IonSegment, IonLabel, IonSegmentButton, IonFooter, IonTabBar, IonTabButton } from '@ionic/angular/standalone';
import { PuntoInteres } from 'src/app/shared/interfaces/punto-interes';
import { GoogleMapsModule } from '@angular/google-maps';
import { environment } from '../../../env/env';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { homeOutline, location, heartOutline, personOutline, imageOutline, imagesOutline, calendarOutline } from 'ionicons/icons';
import { MapaService } from 'src/app/core/services/mapa.service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.page.html',
  styleUrls: ['./mapa.page.scss'],
  standalone: true,
  imports: [
    IonSegment, IonIcon, IonContent, IonHeader, IonTitle, IonToolbar, IonModal, 
    IonButton, IonCard, IonCardContent, CommonModule, FormsModule, GoogleMapsModule,
    IonSegmentButton, IonLabel, IonFooter, IonTabBar, IonTabButton
  ]
})
export class MapaPage implements OnInit {

  constructor(private router: Router, private mapaService: MapaService ) { 
    addIcons({imageOutline,homeOutline,location,calendarOutline,imagesOutline,personOutline,heartOutline});
  }

  // Centro de Calvillo (Ajuste a coordenadas reales)
  center: any = { lat: 21.8469, lng: -102.7184 };
  zoom = 14;
  modalAbierto = false;

  // Signal para almacenar todos los lugares de la BD
  lugares = signal<any[]>([]);
  lugarSeleccionado = signal<any | null>(null);

  // Filtro activo: Iniciamos con '1' que corresponde a "Atractivos"
  categoriaSeleccionada = signal<string>('1');

  // Filtra automáticamente dependiendo de la pestaña seleccionada
  lugaresFiltrados = computed(() => {
    const subtipoId = this.categoriaSeleccionada();
    return this.lugares().filter(lugar => lugar.idSubtipo === subtipoId);
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

  // --- CONEXIÓN A LA BASE DE DATOS ---
  async cargarLugaresDesdeBD() {
    try {
      const data = await this.mapaService.obtenerNegociosMapa(); // Llamada a tu servicio

      const lugaresMapeados = data.map((negocio: any) => {
        return {
          id: negocio.idNegocio,
          nombre: negocio.nombre,
          idSubtipo: String(negocio.idSubtipo_Negocio), // Convertimos el ID numérico a texto para el filtro
          coordenadas: { 
            lat: parseFloat(negocio.latitud), 
            lng: parseFloat(negocio.longitud) 
          },
          direccion: `${negocio.calle} ${negocio.numero}, ${negocio.colonia}`,
          telefono: negocio.telefono || 'Sin teléfono'
        };
      });

      this.lugares.set(lugaresMapeados);
    } catch (error) {
      console.error("Error al cargar los lugares de la BD:", error);
    }
  }

  cambiarCategoria(event: any) {
    this.categoriaSeleccionada.set(event.detail.value); // Cambia entre '1', '2', '3' y '4'
    this.cerrarModal(); // Cierra la tarjeta flotante al cambiar de pestaña
  }

  onMarcadorClick(lugar: any) {
    this.lugarSeleccionado.set(lugar);
    this.modalAbierto = true;
  }

  cerrarModal() {
    this.modalAbierto = false;
  }

  irAMuroSocial() {
    this.router.navigate(['/muro-social']); 
  }
}