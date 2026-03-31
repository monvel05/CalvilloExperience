import { Component, OnInit, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../core/services/reservas.service';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
  IonSelect, IonSelectOption, IonDatetime, 
  IonDatetimeButton, IonModal, IonIcon, IonLabel, IonButton,
  NavController 
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

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, 
    IonSelect, IonSelectOption, IonDatetime,IonicModule, 
    CommonModule,
    IonDatetimeButton, IonModal, IonIcon, IonLabel, IonButton, 
    FormsModule,
    TranslateModule
  ]
})
export class ReservarPage implements OnInit {
  @ViewChild('exitTimeModal') exitTimeModal!: IonModal;
  
  // Variables para fechas y horas (Strings formateados para la DB)
  selectedDate: string = '';
  selectedTime: string = '';
  exitTime: string = '';
  exitTimeValue: string = '';
  numeroPersonas: string = '';
  
  // Lógica del calendario optimizada con índices (0-11)
  currentMonthIndex: number;
  currentYear: number;
  selectedDay: any = null;
  calendarDays: any[] = [];
  
  // Fechas en formato ISO para los componentes de Ionic
  currentDate: string = new Date().toISOString();
  currentTime: string = new Date().toISOString();

  constructor(
    private reservasService: ReservasService,
    private translate: TranslateService,
    private navCtrl: NavController 
  ) {
    addIcons({
      locationOutline, calendarOutline, timeOutline, calendarClearOutline, 
      chevronDownOutline, chevronBackOutline, chevronForwardOutline, 
      checkmarkCircleOutline, cardOutline, callOutline, mailOutline, arrowBackOutline
    }); 

    const today = new Date();
    this.currentMonthIndex = today.getMonth(); // 0 al 11
    this.currentYear = today.getFullYear();
    this.generarCalendario();
  }

  ngOnInit() {
    const usuarioStr = localStorage.getItem('user');
    if (usuarioStr) {
      const usuario = JSON.parse(usuarioStr) as DatosUsuario;
      const idioma = usuario.idIdioma === 2 ? 'en' : 'es';
      this.translate.use(idioma);
    }
  }

  volver() {
    this.navCtrl.back();
  }

  generarCalendario() {
    const firstDayOfMonth = new Date(this.currentYear, this.currentMonthIndex, 1);
    const daysInMonth = new Date(this.currentYear, this.currentMonthIndex + 1, 0).getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay();
    
    const unavailableDays: number[] = [1, 15, 20, 25];
    this.calendarDays = [];
    
    for (let i = 0; i < startingDayOfWeek; i++) {
      this.calendarDays.push({ date: '', available: false, isSelected: false, empty: true });
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      const isAvailable = !unavailableDays.includes(i);
      this.calendarDays.push({
        date: i,
        available: isAvailable,
        isSelected: false,
        empty: false,
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
      const year = this.currentYear;
      
      this.selectedDate = `${year}-${monthForDB}-${day}`;
      this.currentDate = new Date(year, this.currentMonthIndex, parseInt(day)).toISOString();
      
      this.selectedDay.isSelected = false;
      this.selectedDay = null;
    }
  }
  
  abrirModalHoraSalida() {
    this.exitTimeModal.present();
  }
  
  alCambiarHoraSalida(event: any) {
    const selectedTime = event.detail.value;
    if (selectedTime) {
      const date = new Date(selectedTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      this.exitTime = `${hours}:${minutes}:00`; 
      this.exitTimeValue = selectedTime;
    }
    this.exitTimeModal.dismiss();
  }
  
  alCambiarFecha(event: any) {
    const selectedDate = event.detail.value;
    if (selectedDate) {
      const date = new Date(selectedDate);
      this.selectedDate = date.toISOString().split('T')[0]; 
      this.currentDate = selectedDate;
    }
  }
  
  alCambiarHora(event: any) {
    const selectedTime = event.detail.value;
    if (selectedTime) {
      const date = new Date(selectedTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      this.selectedTime = `${hours}:${minutes}:00`; 
      this.currentTime = selectedTime;
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
      alert(this.translate.instant('RESERVE_PAGE.ALERT_MISSING_FIELDS'));
      return;
    }

    const datosReserva = {
      fechaEntrada: this.selectedDate,
      fechaSalida: this.selectedDate,
      horaEntrada: this.selectedTime,
      horaSalida: this.exitTime || this.selectedTime, 
      idUsuario: 1,  
      idNegocio: 1,  
      idEstatus: 1  
    };

    this.reservasService.enviarReserva(datosReserva).subscribe({
      next: (res) => {
        alert(this.translate.instant('RESERVE_PAGE.ALERT_SUCCESS'));
      },
      error: (err) => {
        alert(this.translate.instant('RESERVE_PAGE.ALERT_ERROR'));
      }
    });
  }
}