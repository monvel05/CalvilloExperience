import { Component, OnInit, inject, ViewChild, ElementRef, ChangeDetectorRef, NgZone, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonButton, IonIcon, IonBadge, IonSpinner, IonImg
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, locationOutline, star, checkmarkCircle, 
  timeOutline, mapOutline, addOutline, removeOutline, walkOutline 
} from 'ionicons/icons';
import { Router, ActivatedRoute } from '@angular/router';

// Core y Shared
import { DatosNegocio } from 'src/app/shared/interfaces/datos-negocio';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';
import { TrackingService } from 'src/app/core/services/tracking.service';
import { NegocioService } from 'src/app/core/services/negocio.service';
import { environment } from '../../../env/env'; 

declare var google: any;

@Component({
  selector: 'app-info-negocio',
  templateUrl: './info-negocio.page.html',
  styleUrls: ['./info-negocio.page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonBadge, IonSpinner, IonImg, TranslateModule]
})
export class InfoNegocioPage implements OnInit {
  negocio: DatosNegocio | null = null;
  usuario: DatosUsuario | null = null;
  cargando: boolean = true;
  seccionesAbiertas: boolean[] = [true, false]; // Horario abierto por defecto para UX
  
  @ViewChild('mapaElement', { static: false }) mapaElement!: ElementRef;

  mapaInicializado = false;

  private trackingService = inject(TrackingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); 
  private negocioService = inject(NegocioService);
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);
  private translate = inject(TranslateService);

  constructor() {
    addIcons({
      arrowBackOutline, locationOutline, star, checkmarkCircle,
      timeOutline, mapOutline, addOutline, removeOutline, walkOutline
    });
  }

  ngOnInit() {
    // 1. Configuración de sesión e idioma (Inglés V)
    const usuarioLogueadoStr = localStorage.getItem('user');
    if (usuarioLogueadoStr) {
      this.usuario = JSON.parse(usuarioLogueadoStr) as DatosUsuario;
      const idiomaActual = this.usuario.idIdioma === 2 ? 'en' : 'es';
      this.translate.use(idiomaActual);
    } else {
      this.translate.use('es');
    }

    // 2. Obtención dinámica del ID del negocio
    const state = history.state;
    const id = state.idNegocio || this.route.snapshot.paramMap.get('id');
      
    if (id) {
      this.cargarDesdeAPI(id);
    } else {
      this.router.navigate(['/turista-inicio']); // Redirección de seguridad si no hay ID
    }
  }

  cargarDesdeAPI(id: number | string) {
    // Usamos el Observable directo del servicio optimizado
    this.negocioService.obtenerPorId(id).subscribe({
      next: (data) => {
        // Formateo seguro de datos usando la interfaz unificada
        this.negocio = {
          ...data,
          descripcion: data.descripcion || this.translate.instant('INFO_NEGOCIO.PENDING_DESC'), 
          verificado: data.verificado === 1 || data.verificado === true,
          horario: data.horario || this.translate.instant('INFO_NEGOCIO.NO_HOURS'),
          telefono: data.telefono || this.translate.instant('INFO_NEGOCIO.NO_PHONE'),
          imagen: data.imagen?.length > 0 ? data.imagen : ['assets/images/placeholder.jpg'],
          ubicacion: {
            direccionCompleta: `${data.calle || ''} ${data.numero || ''}, ${data.colonia || ''}`.trim(),
            municipio: data.municipio || 'Calvillo',
            latitud: Number(data.latitud) || 0,
            longitud: Number(data.longitud) || 0
          },
          tieneInventario: data.tieneInventario // Banderas para activar el botón de Reserva
        };
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Error al conectar con la API de Express", err);
        this.cargando = false;
        // Opcional: Mostrar un Toast de error de conexión
      }
    });
  }

  toggleSeccion(index: number) {
    this.seccionesAbiertas[index] = !this.seccionesAbiertas[index];
    
    // Si se abre el mapa y no está inicializado, lo cargamos limpiamente
    if (index === 1 && this.seccionesAbiertas[1] && !this.mapaInicializado) {
      this.cargarGoogleMaps();
    }
  }

  // Carga de script optimizada mediante Promesas en lugar de recursión
  cargarGoogleMaps() {
    if (typeof google !== 'undefined') {
      this.renderizarMapa();
      return;
    }

    if (document.getElementById('google-maps-script')) {
      return; // Ya se está cargando
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.apis.mapsApiKey}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      this.renderizarMapa();
    };
    
    document.head.appendChild(script);
  }

  renderizarMapa() {
    if (!this.mapaElement || !this.negocio) return;

    const el = this.mapaElement.nativeElement;
    const posicion = { 
      lat: this.negocio.ubicacion!.latitud, 
      lng: this.negocio.ubicacion!.longitud 
    };

    const mapOptions = {
      center: posicion,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true, 
      zoomControl: true,
      gestureHandling: 'cooperative' // Evita que el mapa bloquee el scroll de la página
    };

    this.ngZone.run(() => {
      const map = new google.maps.Map(el, mapOptions);
      new google.maps.Marker({
        position: posicion,
        map: map,
        title: this.negocio?.nombre
      });
      this.mapaInicializado = true;
    });
  }

  iniciarReserva() {
    // Registramos la telemetría antes de navegar
    this.trackingService.registrarEvento('INICIAR_RESERVA', { idNegocio: this.negocio?.idNegocio });
    this.router.navigate(['/reservar', this.negocio?.idNegocio]); // Mandamos el ID en la URL
  }

  irAMapa() {
    if (!this.negocio || !this.negocio.ubicacion) return;
    const lat = this.negocio.ubicacion.latitud;
    const lng = this.negocio.ubicacion.longitud;
    
    // Deep Link oficial de Google Maps para dar indicaciones de ruta
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_system');
  }

  volver() {
    switch (this.usuario?.idTipoUsuario) {
      case 1: this.router.navigate(['/administrador-inicio']); break;
      case 2: this.router.navigate(['/turista-inicio']); break;
      case 3: this.router.navigate(['/negocio-inicio']); break;
      default: this.router.navigate(['/login']);
    }
  }
}