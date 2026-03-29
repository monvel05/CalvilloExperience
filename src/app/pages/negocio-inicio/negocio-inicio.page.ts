import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { DatosNegocio } from '../../shared/interfaces/guardar-negocio'; // <-- Verifica esta ruta
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButton, 
  IonIcon, IonItem, IonLabel, IonInput, IonToggle, IonTextarea,
  IonCard, IonSpinner, IonButtons, IonAvatar,
  IonSelect, IonSelectOption // <-- IMPORTANTÍSIMO TENER ESTOS AQUÍ
} from '@ionic/angular/standalone';

import { addIcons } from 'ionicons';
import { 
  storefrontOutline, locationOutline, timeOutline, 
  callOutline, checkmarkCircle, imageOutline, saveOutline,
  eyeOutline, calendarOutline, personCircleOutline, arrowBackOutline, 
  settingsOutline, pricetagOutline, calendarNumberOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-negocio-inicio',
  templateUrl: './negocio-inicio.page.html',
  styleUrls: ['./negocio-inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, 
    IonTitle, IonButton, IonIcon, IonItem, IonLabel, IonInput, 
    IonToggle, IonTextarea, IonCard, IonSpinner, IonButtons, 
    IonSelect, IonSelectOption // <-- ESTO QUITA LOS ERRORES DEL HTML
  ]
})
export class NegocioInicioPage implements OnInit {
  private router = inject(Router);

  // Variables necesarias para el HTML
  usuario: any = { fotoPerfil: null }; 
  cargando: boolean = false; // Lo ponemos en false para ver la interfaz
  guardando: boolean = false;
  imagenPredeterminada: string = 'https://i.pinimg.com/736x/c0/55/a4/c055a4384e5b71030800dc56e2a9a07f.jpg';

  // Objeto negocio inicializado
  negocio: DatosNegocio = {
    idNegocio: 0,
    nombre: '',
    descripcion: '',
    idSubtipo_Negocio: 1,
    verificado: false,
    horario: '',
    telefono: '',
    calificacionMedia: 0,
    imagen: [],
    idUsuario: 0,
    idUbicacion: 0,
    ubicacion: {
      direccionCompleta: '',
      municipio: '',
      latitud: '',
      longitud: ''
    },
    tieneInventario: false,
    permitirReservas: false
  };

  constructor() {
    addIcons({
      personCircleOutline, imageOutline, storefrontOutline, 
      pricetagOutline, timeOutline, callOutline, 
      calendarOutline, locationOutline, saveOutline, calendarNumberOutline
    });
  }

  ngOnInit() {
    console.log('Componente inicializado visualmente');
  }

  // Funciones que reclama el HTML
  irAPerfil() {
    console.log('irAPerfil clickeado');
  }

  cambiarImagen() {
    console.log('cambiarImagen clickeado');
  }

  guardarCambios() {
    console.log('guardarCambios clickeado');
  }
}