import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router'; // Para leer el ID de la URL
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonSelect, IonSelectOption, IonDatetime, IonSpinner,
  IonDatetimeButton, IonModal, IonIcon, IonLabel, IonButton,
  NavController, ToastController 
} from '@ionic/angular/standalone';
import { 
  arrowBackOutline, locationOutline, calendarOutline, timeOutline, 
  calendarClearOutline, chevronDownOutline, chevronBackOutline, 
  chevronForwardOutline, checkmarkCircleOutline, cardOutline, 
  callOutline, mailOutline 
} from 'ionicons/icons';
import { addIcons } from 'ionicons';

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';
import { ReservasService } from '../../core/services/reservas.service';
import { NegocioService } from '../../core/services/negocio.service';
import { DatosNegocio } from 'src/app/shared/interfaces/datos-negocio';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    TranslateModule,
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
    IonSelect, IonSelectOption, IonDatetime, IonSpinner,
    IonDatetimeButton, IonModal, IonIcon, IonLabel, IonButton
  ]
})
export class ReservarPage implements OnInit {
  @ViewChild('exitTimeModal') exitTimeModal!: IonModal;
  
  private reservasService = inject(ReservasService);
  private negocioService = inject(NegocioService);
  private translate = inject(TranslateService);
  private navCtrl = inject(NavController);
  private route = inject(ActivatedRoute);
  private toastCtrl = inject(ToastController);

  // Variables de Negocio y Usuario
  negocio: DatosNegocio | null = null;
  idUsuarioLogueado: number = 0;
  cargando: boolean = true;

  // Variables para fechas y horas
  selectedDate: string = '';
  selectedTime: string = '';
  exitTime: string = '';
  exitTimeValue: string = '';
  numeroPersonas: string = '';
  
  // Lógica del calendario
  currentMonthIndex: number;
  currentYear: number;
  selectedDay: any = null;
  calendarDays: any[] = [];
  
  currentDate: string = new Date().toISOString();
  currentTime: string = new Date().toISOString();

  constructor() {
    addIcons({
      locationOutline, calendarOutline, timeOutline, calendarClearOutline, 
      chevronDownOutline, chevronBackOutline, chevronForwardOutline, 
      checkmarkCircleOutline, cardOutline, callOutline, mailOutline, arrowBackOutline
    }); 

    const today = new Date();
    this.currentMonthIndex = today.getMonth(); 
    this.currentYear = today.getFullYear();
    this.generarCalendario();
  }

  ngOnInit() {
    // 1. Obtener datos del usuario logueado
    const usuarioStr = localStorage.getItem('user');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr) as DatosUsuario;
      this.idUsuarioLogueado = usuario.idUsuario;
      this.translate.use(usuario.idIdioma === 2 ? 'en' : 'es');
    }

    // 2. Obtener el ID del negocio desde la URL y cargar sus datos
    const idNegocio = this.route.snapshot.paramMap.get('id');
    if (idNegocio) {
      this.negocioService.obtenerPorId(idNegocio).subscribe({
        next: (data) => {
          this.negocio = data;
          this.cargando = false;
        },
        error: (err) => {
          console.error("Error al cargar negocio para reservar", err);
          this.cargando = false;
        }
      });
    } else {
      this.cargando = false;
    }
  }

  volver() {
    this.navCtrl.back();
  }

  // --- LÓGICA DEL CALENDARIO (Se mantiene igual, solo optimizamos) ---
  generarCalendario() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonthIndex, 1);
    const daysInMonth = new Date(this.currentYear, this.currentMonthIndex + 1, 0).getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    // Aquí en el futuro podrías conectar los días ocupados reales del backend
    const unavailableDays: number[] = [1, 15, 20, 25]; 
    this.calendarDays = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      this.calendarDays.push({ date: '', available: false, isSelected: false, empty: true });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isAvailable = !unavailableDays.includes(i);
      this.calendarDays.push({
        date: i, available: isAvailable, isSelected: false, empty: false,
        fullDate: new Date(this.currentYear, this.currentMonthIndex, i)
      });
    }
  }
  
  seleccionarDia(day: any) {
    if (day.empty || !day.available) return;
    this.calendarDays.forEach(d => d.isSelected = false);
    day.isSelected = true;
    this.selectedDay = day;
  }
  
  aceptarFecha() {
    if (this.selectedDay) {
      const day = this.selectedDay.date.toString().padStart(2, '0');
      const monthForDB = (this.currentMonthIndex + 1).toString().padStart(2, '0');
      
      this.selectedDate = `${this.currentYear}-${monthForDB}-${day}`;
      this.currentDate = new Date(this.currentYear, this.currentMonthIndex, parseInt(day)).toISOString();
      
      this.selectedDay.isSelected = false;
      this.selectedDay = null;
    }
  }
  
  // --- MANEJO DE HORAS ---
  abrirModalHoraSalida() { this.exitTimeModal.present(); }
  
  alCambiarHoraSalida(event: any) {
    const selectedTime = event.detail.value;
    if (selectedTime) {
      const date = new Date(selectedTime);
      this.exitTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`; 
      this.exitTimeValue = selectedTime;
    }
    this.exitTimeModal.dismiss();
  }
  
  alCambiarFecha(event: any) {
    const selectedDate = event.detail.value;
    if (selectedDate) {
      this.selectedDate = new Date(selectedDate).toISOString().split('T')[0]; 
      this.currentDate = selectedDate;
    }
  }
  
  alCambiarHora(event: any) {
    const selectedTime = event.detail.value;
    if (selectedTime) {
      const date = new Date(selectedTime);
      this.selectedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`; 
      this.currentTime = selectedTime;
    }
  }

  mesAnterior() {
    if (this.currentMonthIndex === 0) { this.currentMonthIndex = 11; this.currentYear--; }
    else { this.currentMonthIndex--; }
    this.generarCalendario();
  }
  
  mesSiguiente() {
    if (this.currentMonthIndex === 11) { this.currentMonthIndex = 0; this.currentYear++; }
    else { this.currentMonthIndex++; }
    this.generarCalendario();
  }
  
  async mostrarMensaje(mensaje: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje, duration: 3000, position: 'top', color: color
    });
    await toast.present();
  }

  // --- ENVÍO DE RESERVA AL BACKEND ---
  confirmarReserva() {
    if (!this.selectedDate || !this.selectedTime || !this.numeroPersonas) {
      this.mostrarMensaje(this.translate.instant('RESERVE_PAGE.ALERT_MISSING_FIELDS'));
      return;
    }

    if (!this.negocio || this.idUsuarioLogueado === 0) {
      this.mostrarMensaje('Error de sesión o de negocio no válido');
      return;
    }

    // Armamos el objeto con los datos REALES
    const datosReserva = {
      fechaEntrada: this.selectedDate,
      fechaSalida: this.selectedDate, // Por ahora el mismo día
      horaEntrada: this.selectedTime,
      horaSalida: this.exitTime || this.selectedTime, 
      idUsuario: this.idUsuarioLogueado,  
      idNegocio: this.negocio.idNegocio,  
      idEstatus: 1 // 1 = Pendiente
    };

    this.reservasService.enviarReserva(datosReserva).subscribe({
      next: (res) => {
        this.mostrarMensaje(this.translate.instant('RESERVE_PAGE.ALERT_SUCCESS'), 'success');
        // Esperamos un segundo y lo devolvemos a la información del negocio
        setTimeout(() => this.volver(), 1500);
      },
      error: (err) => {
        console.error("Error al guardar:", err);
        this.mostrarMensaje(this.translate.instant('RESERVE_PAGE.ALERT_ERROR'));
      }
    });
  }
}