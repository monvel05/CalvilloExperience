import { Component, OnInit, inject } from '@angular/core';
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


@Component({
  selector: 'app-info-negocio',
  templateUrl: './info-negocio.page.html',
  styleUrls: ['./info-negocio.page.scss'],
  standalone: true,
  imports: [CommonModule, IonContent, IonButton, IonIcon, IonBadge, IonSpinner, TranslateModule]
})
export class InfoNegocioPage implements OnInit {
  negocio: DatosNegocio | null = null;
  cargando: boolean = true;
  seccionesAbiertas: boolean[] = [false, false];
  // Se eliminó la variable imagenPrincipal

  constructor() {
    addIcons({
      arrowBackOutline, locationOutline, star, checkmarkCircle,
      timeOutline, mapOutline, addOutline, removeOutline, walkOutline
    });
  }

  ngOnInit() {
    this.cargarDatosSimulados();
  }

  cargarDatosSimulados() {
    setTimeout(() => {
      this.negocio = {
        idNegocio: 1,
        nombre: 'Artesanos de Calvillo',
        descripcion: 'Descubre la magia de la guayaba en nuestro taller histórico. Elaboramos dulces tradicionales siguiendo recetas familiares que han pasado de generación en generación. Ven y prueba la historia de nuestro pueblo.',
        verificado: true,
        horario: 'Lunes a Domingo - 9:00 AM a 6:00 PM',
        telefono: '+52 495 123 4567',
        calificacionMedia: 4.8,
        // Modificado: Ahora es una sola propiedad de tipo string
        imagen: 'https://images.unsplash.com/photo-1605651202774-7d573fd3f12d?auto=format&fit=crop&q=80&w=800',
        ubicacion: {
          direccionCompleta: 'Benito Juárez #12, Centro Histórico, Calvillo, AGS',
          municipio: 'Calvillo',
          latitud: '21.8469',
          longitud: '-102.7188'
        },
        tieneInventario: true 
      } as unknown as DatosNegocio; // Forzamos el tipo por si aún no actualizas la interfaz
      
      this.cargando = false;
    }, 800);
  }

  // Se eliminó la función cambiarImagen()

  toggleSeccion(index: number) {
    this.seccionesAbiertas[index] = !this.seccionesAbiertas[index];
  }

  iniciarReserva() {
    console.log('Navegando al flujo de reserva para:', this.negocio?.nombre);
  }
}