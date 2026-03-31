import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { 
  IonicModule, NavController, ToastController, IonModal 
} from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, locationOutline, calendarOutline, timeOutline, 
  calendarClearOutline, chevronDownOutline, chevronBackOutline, 
  chevronForwardOutline, checkmarkCircleOutline, cardOutline, 
  callOutline, mailOutline 
} from 'ionicons/icons';

// Servicios e Interfaces
import { ReservasService } from '../../core/services/reservas.service';
import { NegocioService } from '../../core/services/negocio.service';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';
import { DatosNegocio } from 'src/app/shared/interfaces/datos-negocio';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, TranslateModule]
})
export class ReservarPage implements OnInit {
  @ViewChild('exitTimeModal') exitTimeModal!: IonModal;
  
  // Inyección de dependencias
  private reservasService = inject(ReservasService);
  private negocioService = inject(NegocioService);
  private translate = inject(TranslateService);
  private navCtrl = inject(NavController);
  private route = inject(ActivatedRoute);
  private toastCtrl = inject(ToastController);

  // Datos dinámicos
  usuario: DatosUsuario | null = null;
  negocio: DatosNegocio | null = null;
  
  // Variables de formulario
  selectedDate: string = '';
  selectedTime: string = '';
  exitTime: string = '';
  exitTimeValue: string = '';
  numeroPersonas: string = '';
  
  // Calendario
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
    // 1. Cargar Usuario y establecer Idioma
    const usuarioStr = localStorage.getItem('user');
    if (usuarioStr) {
      this.usuario = JSON.parse(usuarioStr) as DatosUsuario;
      this.translate.use(this.usuario.idIdioma === 2 ? 'en' : 'es');
    }

    // 2. Cargar datos del negocio basado en la URL
    const idNegocio = this.route.snapshot.paramMap.get('id');
    if (idNegocio) {
      this.negocioService.obtenerPorId(idNegocio).subscribe({
        next: (data) => this.negocio = data,
        error: (err) => this.mostrarToast('Error al cargar datos del negocio', 'danger')
      });
    }
  }

  volver() {
    this.navCtrl.back();
  }

  generarCalendario() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonthIndex, 1);
    const daysInMonth = new Date(this.currentYear, this.currentMonthIndex + 1, 0).getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    const unavailableDays: number[] = [1, 15, 20, 25]; // Aquí podrías conectar a tu inventario real
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
  
  abrirModalHoraSalida() { this.exitTimeModal.present(); }
  
  alCambiarHoraSalida(event: any) {
    if (event.detail.value) {
      const date = new Date(event.detail.value);
      this.exitTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`; 
      this.exitTimeValue = event.detail.value;
    }
    this.exitTimeModal.dismiss();
  }
  
  alCambiarFecha(event: any) {
    if (event.detail.value) {
      this.selectedDate = new Date(event.detail.value).toISOString().split('T')[0]; 
      this.currentDate = event.detail.value;
    }
  }
  
  alCambiarHora(event: any) {
    if (event.detail.value) {
      const date = new Date(event.detail.value);
      this.selectedTime = `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:00`; 
      this.currentTime = event.detail.value;
    }
  }

  mesAnterior() {
    this.currentMonthIndex--;
    if (this.currentMonthIndex < 0) {
      this.currentMonthIndex = 11;
      this.currentYear--;
    }
    this.generarCalendario();
  }
  
  mesSiguiente() {
    this.currentMonthIndex++;
    if (this.currentMonthIndex > 11) {
      this.currentMonthIndex = 0;
      this.currentYear++;
    }
    this.generarCalendario();
  }
  
  confirmarReserva() {
    if (!this.selectedDate || !this.selectedTime || !this.numeroPersonas) {
      this.mostrarToast(this.translate.instant('RESERVE_PAGE.ALERT_MISSING_FIELDS'), 'warning');
      return;
    }

    if (!this.usuario || !this.negocio) {
      this.mostrarToast('Error de sesión o negocio no encontrado', 'danger');
      return;
    }

    const datosReserva = {
      fechaEntrada: this.selectedDate,
      fechaSalida: this.selectedDate,
      horaEntrada: this.selectedTime,
      horaSalida: this.exitTime || this.selectedTime, 
      idUsuario: this.usuario.idUsuario, 
      idNegocio: this.negocio.idNegocio, 
      idEstatus: 1 
    };

    this.reservasService.enviarReserva(datosReserva).subscribe({
      next: () => {
        this.mostrarToast(this.translate.instant('RESERVE_PAGE.ALERT_SUCCESS'), 'success');
        setTimeout(() => this.navCtrl.navigateRoot('/turista-inicio'), 1500); // Lo mandamos al inicio tras el éxito
      },
      error: () => this.mostrarToast(this.translate.instant('RESERVE_PAGE.ALERT_ERROR'), 'danger')
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color: color,
      position: 'top',
      cssClass: 'custom-toast'
    });
    await toast.present();
  }
}