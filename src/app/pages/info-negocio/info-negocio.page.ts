import { Component, OnInit, inject, ViewChild, ElementRef, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  IonContent, IonButton, IonIcon, IonBadge, IonSpinner 
} from '@ionic/angular/standalone';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, locationOutline, star, checkmarkCircle, 
  timeOutline, mapOutline, addOutline, removeOutline, walkOutline 
} from 'ionicons/icons';
import { DatosNegocio } from 'src/app/shared/interfaces/datos-negocio';
import { TrackingService } from 'src/app/core/services/tracking-service';
import { Router, ActivatedRoute } from '@angular/router';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';
import { environment } from '../../../env/env'; 
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
  seccionesAbiertas: boolean[] = [false, false];
  
  @ViewChild('mapaElement', { static: false }) mapaElement!: ElementRef;

  mapaInicializado = false;

  private trackingService = inject(TrackingService);
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Para leer parámetros de la URL
  private negocioService = inject(NegocioService); // Tu nuevo servicio
  private ngZone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  constructor() {
    addIcons({
      arrowBackOutline, locationOutline, star, checkmarkCircle,
      timeOutline, mapOutline, addOutline, removeOutline, walkOutline
    });
  }

  ngOnInit() {
    // Leemos el estado de la navegación por si mandamos el objeto completo o el ID
    const state = history.state;
    
    // CASO 1: La interfaz ya trae todos los datos completos
    if (state && state.negocioCompleto) {
      this.negocio = state.negocioCompleto;
      this.cargando = false;
    } else {
      // Buscamos un ID (puede venir en el state o en la URL, ej: /info-negocio/5)
      const id = state.idNegocio || this.route.snapshot.paramMap.get('id');
      
      if (id) {
        // CASO 2: Solo tenemos el ID, hay que llamar a Express
        this.cargarDesdeAPI(id);
      } else {
        // CASO 3: Interfaz completamente vacía
        this.cargarDatosSimulados();
      }
    }
  }

  async cargarDesdeAPI(id: number | string) {
    try {
      const data = await this.negocioService.obtenerNegocioPorId(id);
      
      if (data) {
        // Mapeamos los datos de Express a la interfaz DatosNegocio
        this.negocio = {
          idNegocio: data.idNegocio,
          nombre: data.nombre,
          // Rellenamos temporalmente lo que la consulta SQL aún no trae
          descripcion: data.descripcion || 'Descripción pendiente...', 
          verificado: data.verificado === 1,
          horario: data.horario || 'Horarios no disponibles',
          telefono: data.telefono || 'Sin teléfono',
          calificacionMedia: 5.0, // Pendiente de calcular con reseñas
          imagen: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=800',
          ubicacion: {
            direccionCompleta: `${data.calle || ''} ${data.numero || ''}, ${data.colonia || ''}`.trim(),
            municipio: data.municipio || 'Calvillo',
            latitud: data.latitud?.toString() || '0',
            longitud: data.longitud?.toString() || '0'
          },
          tieneInventario: false // Pendiente de cruzar con tabla de inventario
        } as unknown as DatosNegocio;
      } else {
        // Si la API no devuelve nada, usamos los simulados como respaldo
        this.cargarDatosSimulados();
      }
    } catch (error) {
      console.error("Error al conectar con la API, cargando simulados", error);
      this.cargarDatosSimulados();
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  cargarDatosSimulados() {
    setTimeout(() => {
      this.negocio = {
        idNegocio: 1,
        nombre: 'Artesanos de Calvillo',
        descripcion: 'Descubre la magia de la guayaba en nuestro taller histórico...',
        verificado: true,
        horario: 'Lunes a Domingo - 9:00 AM a 6:00 PM',
        telefono: '+52 495 123 4567',
        calificacionMedia: 4.8,
        imagen: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=800',
        ubicacion: {
          direccionCompleta: 'Benito Juárez #12, Centro Histórico, Calvillo, AGS',
          municipio: 'Calvillo',
          latitud: '21.8469',
          longitud: '-102.7188'
        },
        tieneInventario: true 
      } as unknown as DatosNegocio;
      
      this.cargando = false;
      this.cdr.detectChanges();
    }, 800);
  }

  toggleSeccion(index: number) {
    this.seccionesAbiertas[index] = !this.seccionesAbiertas[index];
    if (index === 1 && this.seccionesAbiertas[1] && !this.mapaInicializado) {
      this.cargarAPIYRenderizar(0);
    }
  }

  cargarAPIYRenderizar(intentosDOM: number) {
    if (typeof google !== 'undefined') {
      this.intentarRenderizarMapa(intentosDOM);
      return;
    }

    const scriptExistente = document.getElementById('google-maps-script-info');
    if (scriptExistente) {
      setTimeout(() => this.cargarAPIYRenderizar(intentosDOM), 500);
      return;
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script-info';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.apis.mapsApiKey}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      this.intentarRenderizarMapa(intentosDOM);
    };
    
    document.head.appendChild(script);
  }

  intentarRenderizarMapa(intentos: number) {
    if (!this.mapaElement || !this.negocio) return;

    if (intentos > 8) return;

    const el = this.mapaElement.nativeElement;
    
    if (el.offsetWidth === 0 || el.offsetHeight === 0) {
      const tiempoEspera = 300 + (intentos * 100);
      setTimeout(() => this.intentarRenderizarMapa(intentos + 1), tiempoEspera);
      return;
    }

    const lat = parseFloat(this.negocio.ubicacion.latitud);
    const lng = parseFloat(this.negocio.ubicacion.longitud);
    const posicion = { lat, lng };

    const mapOptions = {
      center: posicion,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      disableDefaultUI: true, 
      zoomControl: true,
      scrollwheel: false,
    };

    this.ngZone.run(() => {
      const map = new google.maps.Map(el, mapOptions);
      new google.maps.Marker({
        position: posicion,
        map: map,
        title: this.negocio?.nombre
      });
      this.mapaInicializado = true;
      this.cdr.detectChanges();
    });
  }

  iniciarReserva() {
    this.trackingService.registrarEvento('INICIAR_RESERVA', this.negocio?.idNegocio || 0);
    this.router.navigate(['/reserva']);
  }

  irAMapa() {
    if (!this.negocio) return;
    const lat = this.negocio.ubicacion.latitud;
    const lng = this.negocio.ubicacion.longitud;
    
    // URL pulida para evitar fallos en móviles
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_system');
  }

  volver() {
    switch (this.usuario?.idTipoUsuario) {
      case 1: this.router.navigate(['/administrador-inicio']); break;
      case 2: this.router.navigate(['/turista-inicio']); break;
      case 3: this.router.navigate(['/negocio-inicio']); break;
      default: this.router.navigate(['/home']);
    }
  }
}