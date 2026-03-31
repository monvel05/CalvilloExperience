import { Component, OnInit, inject, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonButton, IonIcon, IonBadge, IonSpinner, NavController
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, locationOutline, star, checkmarkCircle, 
  timeOutline, mapOutline, addOutline, removeOutline, walkOutline, callOutline
} from 'ionicons/icons';
import { DatosNegocio } from 'src/app/shared/interfaces/datos-negocio';
import { TrackingService } from 'src/app/core/services/tracking-service';
import { ActivatedRoute } from '@angular/router';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';
import { environment } from 'src/env/env'; // Ajusta la ruta a tu env si es necesario
import { NegocioService } from 'src/app/core/services/negocio.service';

declare var google: any;

@Component({
  selector: 'app-info-negocio',
  templateUrl: './info-negocio.page.html',
  styleUrls: ['./info-negocio.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonBadge, IonSpinner, TranslateModule]
})
export class InfoNegocioPage implements OnInit {
  negocio: DatosNegocio | null = null;
  usuario: DatosUsuario | null = null;
  cargando: boolean = true;
  seccionesAbiertas: boolean[] = [true, false]; // El horario (0) viene abierto por defecto
  
  @ViewChild('mapaElement', { static: false }) mapaElement!: ElementRef;
  mapaInicializado = false;

  private trackingService = inject(TrackingService);
  private route = inject(ActivatedRoute); 
  private negocioService = inject(NegocioService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);
  private navCtrl = inject(NavController);

  constructor() {
    addIcons({
      arrowBackOutline, locationOutline, star, checkmarkCircle,
      timeOutline, mapOutline, addOutline, removeOutline, walkOutline, callOutline
    });
  }

  ngOnInit() {
    this.inicializarUsuario();
    this.cargarDatos();
  }

  private inicializarUsuario() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      this.usuario = JSON.parse(userStr);
      // Aplicamos el idioma que prefiera el usuario
      this.translate.use(this.usuario?.idIdioma === 2 ? 'en' : 'es');
    }
  }

  private cargarDatos() {
    // Obtenemos el ID de la URL (ej. /info-negocio/5)
    const id = this.route.snapshot.paramMap.get('id');
    
    if (id) {
      this.negocioService.obtenerPorId(id).subscribe({
        next: (data) => {
          this.negocio = data;
          this.cargando = false;
          this.cdr.detectChanges(); // Forzamos actualización de la vista
        },
        error: (err) => {
          console.error("Error al cargar el negocio", err);
          this.cargando = false;
        }
      });
    }
  }

  toggleSeccion(index: number) {
    this.seccionesAbiertas[index] = !this.seccionesAbiertas[index];
    
    // Si abre la pestaña del mapa (índice 1) y no se ha inicializado, lo cargamos
    if (index === 1 && this.seccionesAbiertas[1] && !this.mapaInicializado) {
      this.cargarAPIYRenderizar(0);
    }
  }

  cargarAPIYRenderizar(intentos: number) {
    // Si la API de Google ya existe en memoria, pintamos el mapa directo
    if (typeof google !== 'undefined') {
      this.intentarRenderizarMapa(intentos);
      return;
    }
    
    // Evitamos duplicar el script si el usuario da clics muy rápido
    const scriptExistente = document.getElementById('google-maps-script');
    if (scriptExistente) {
        setTimeout(() => this.cargarAPIYRenderizar(intentos), 500);
        return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.apis.mapsApiKey}`;
    script.async = true; 
    script.defer = true;
    script.onload = () => this.intentarRenderizarMapa(0);
    document.head.appendChild(script);
  }

  intentarRenderizarMapa(intentos: number) {
    if (!this.mapaElement || !this.negocio || intentos > 5) return;
    
    const el = this.mapaElement.nativeElement;
    
    // Si el div del mapa aún no tiene alto/ancho en el DOM, esperamos
    if (el.offsetWidth === 0) {
      setTimeout(() => this.intentarRenderizarMapa(intentos + 1), 500);
      return;
    }
    
    this.ngZone.run(() => {
      const pos = { 
        lat: parseFloat(this.negocio!.ubicacion.latitud), 
        lng: parseFloat(this.negocio!.ubicacion.longitud) 
      };
      
      const map = new google.maps.Map(el, { center: pos, zoom: 16, disableDefaultUI: true });
      
      new google.maps.Marker({ 
        position: pos, 
        map: map, 
        title: this.negocio!.nombre 
      });
      
      this.mapaInicializado = true;
    });
  }

  volver() {
    // Navegación nativa de Ionic hacia atrás, mantiene el estado previo de los filtros
    this.navCtrl.back(); 
  }

  irAMapa() {
    if (!this.negocio) return;
    const lat = this.negocio.ubicacion.latitud;
    const lng = this.negocio.ubicacion.longitud;
    // URL universal que abre la app de Google Maps en móviles
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_system');
  }

  iniciarReserva() {
    if (this.negocio) {
      this.trackingService.registrarEvento('INICIAR_RESERVA', this.negocio.idNegocio);
      this.navCtrl.navigateForward(`/reservar/${this.negocio.idNegocio}`);
    }
  }
}