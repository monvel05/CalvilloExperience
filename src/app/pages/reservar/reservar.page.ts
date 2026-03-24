import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservasService } from '../../core/services/reservas.service';
import { 
  IonContent, 
  IonHeader, 
  IonTitle, 
  IonToolbar, 
  IonButtons, 
  IonBackButton,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonIcon,
  IonLabel,
  IonButton // Asegúrate de incluir IonButton en los imports
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
  standalone: true,
  imports: [
    CommonModule, // Necesario para ngFor y ngIf
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButtons, 
    IonBackButton,
    IonSelect,
    IonSelectOption,
    IonDatetime,
    IonDatetimeButton,
    IonModal,
    IonIcon,
    IonLabel,
    IonButton,
    FormsModule 
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
  
  // Variables del calendario
  currentMonth: string = '';
  currentYear: number = 2026;
  monthNames: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  selectedDay: any = null;
  calendarDays: any[] = [];
  
  // Fechas en formato ISO para los componentes de Ionic
  currentDate: string = new Date().toISOString();
  currentTime: string = new Date().toISOString();

  // Inyectamos el servicio respetando el orden de carpetas de tu equipo
  constructor(private reservasService: ReservasService) {
    
    const today = new Date();
    this.currentMonth = this.monthNames[today.getMonth()];
    this.currentYear = today.getFullYear();
    this.generateCalendar();
  }

  ngOnInit() { }

  generateCalendar() {
    const monthIndex = this.monthNames.indexOf(this.currentMonth);
    const firstDayOfMonth = new Date(this.currentYear, monthIndex, 1);
    const daysInMonth = new Date(this.currentYear, monthIndex + 1, 0).getDate();
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
        fullDate: new Date(this.currentYear, monthIndex, i)
      });
    }
  }
  
  selectDay(day: any) {
    if (day.empty || !day.available) return;
    this.calendarDays.forEach(d => d.isSelected = false);
    day.isSelected = true;
    this.selectedDay = day;
  }
  
  acceptDate() {
    if (this.selectedDay) {
      const day = this.selectedDay.date.toString().padStart(2, '0');
      const monthIndex = (this.monthNames.indexOf(this.currentMonth) + 1).toString().padStart(2, '0');
      const year = this.currentYear;
      
      // Formato YYYY-MM-DD que espera MySQL
      this.selectedDate = `${year}-${monthIndex}-${day}`;
      this.currentDate = new Date(year, parseInt(monthIndex) - 1, parseInt(day)).toISOString();
      
      this.selectedDay.isSelected = false;
      this.selectedDay = null;
    }
  }
  
  openExitTimeModal() {
    this.exitTimeModal.present();
  }
  
  onExitTimeChange(event: any) {
    const selectedTime = event.detail.value;
    if (selectedTime) {
      const date = new Date(selectedTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      this.exitTime = `${hours}:${minutes}:00`; // Formato HH:mm:ss
      this.exitTimeValue = selectedTime;
    }
    this.exitTimeModal.dismiss();
  }
  
  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    if (selectedDate) {
      const date = new Date(selectedDate);
      this.selectedDate = date.toISOString().split('T')[0]; // Extrae YYYY-MM-DD
      this.currentDate = selectedDate;
    }
  }
  
  onTimeChange(event: any) {
    const selectedTime = event.detail.value;
    if (selectedTime) {
      const date = new Date(selectedTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      this.selectedTime = `${hours}:${minutes}:00`; // Formato HH:mm:ss
      this.currentTime = selectedTime;
    }
  }

  // Navegación de meses
  prevMonth() {
    const currentMonthIndex = this.monthNames.indexOf(this.currentMonth);
    let newMonthIndex = currentMonthIndex - 1;
    if (newMonthIndex < 0) { newMonthIndex = 11; this.currentYear--; }
    this.currentMonth = this.monthNames[newMonthIndex];
    this.generateCalendar();
  }
  
  nextMonth() {
    const currentMonthIndex = this.monthNames.indexOf(this.currentMonth);
    let newMonthIndex = currentMonthIndex + 1;
    if (newMonthIndex > 11) { newMonthIndex = 0; this.currentYear++; }
    this.currentMonth = this.monthNames[newMonthIndex];
    this.generateCalendar();
  }
  
  // FUNCIONALIDAD: Guardar en Base de Datos
  confirmarReserva() {
    if (!this.selectedDate || !this.selectedTime || !this.numeroPersonas) {
      alert('Por favor, completa la fecha, hora de entrada y número de personas.');
      return;
    }

    // Adaptado exactamente al server.js de tu compañero
    const datosReserva = {
      fechaEntrada: this.selectedDate,
      fechaSalida: this.selectedDate,
      horaEntrada: this.selectedTime,
      horaSalida: this.exitTime || this.selectedTime, // Si no hay salida, usamos la de entrada
      idUsuario: 1,  // ID estático por ahora
      idNegocio: 1,  // ID para Cenaduría Doña Lupe
      idEstatus: 1   // 1 = Activa
    };

    this.reservasService.enviarReserva(datosReserva).subscribe({
      next: (res) => {
        console.log('✅ Reserva guardada:', res);
        alert('Reserva creada con éxito en Calvillo Experience');
      },
      error: (err) => {
        console.error('❌ Error al guardar:', err);
        alert('Hubo un problema al conectar con el servidor.');
      }
    });
  }
}