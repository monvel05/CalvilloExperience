import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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
  IonLabel
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-reservar',
  templateUrl: './reservar.page.html',
  styleUrls: ['./reservar.page.scss'],
  standalone: true,
  imports: [
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
    FormsModule 
  ]
})
export class ReservarPage implements OnInit {
  @ViewChild('exitTimeModal') exitTimeModal!: IonModal;
  
  // Variables para fechas y horas
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
  
  // Fecha actual para el datetime
  currentDate: string = new Date().toISOString();
  currentTime: string = new Date().toISOString();

  constructor() {
    const today = new Date();
    this.currentMonth = this.monthNames[today.getMonth()];
    this.currentYear = today.getFullYear();
    this.generateCalendar();
  }

  ngOnInit() { }

  // Generar días del calendario
  generateCalendar() {
    // Obtener el primer día del mes y cuántos días tiene
    const monthIndex = this.monthNames.indexOf(this.currentMonth);
    const firstDayOfMonth = new Date(this.currentYear, monthIndex, 1);
    const daysInMonth = new Date(this.currentYear, monthIndex + 1, 0).getDate();
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Domingo, 1 = Lunes, etc.
    
    // Días no disponibles (simulación - puedes conectar con tu API)
    const unavailableDays: number[] = [1, 15, 20, 25];
    
    this.calendarDays = [];
    
    // Agregar días vacíos al inicio para alinear con el día de la semana
    for (let i = 0; i < startingDayOfWeek; i++) {
      this.calendarDays.push({
        date: '',
        available: false,
        isSelected: false,
        empty: true
      });
    }
    
    // Agregar los días del mes
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
  
  // Seleccionar un día
  selectDay(day: any) {
    if (day.empty || !day.available) return;
    
    // Remover selección anterior
    this.calendarDays.forEach(d => {
      if (d.isSelected) d.isSelected = false;
    });
    
    // Seleccionar nuevo día
    day.isSelected = true;
    this.selectedDay = day;
  }
  
  // Aceptar fecha seleccionada
  acceptDate() {
    if (this.selectedDay) {
      // Formatear la fecha seleccionada
      const day = this.selectedDay.date;
      const month = this.currentMonth;
      const year = this.currentYear;
      this.selectedDate = `${day} ${month} ${year}`;
      
      // También guardar en formato ISO para posibles usos
      const monthIndex = this.monthNames.indexOf(this.currentMonth);
      const dateObj = new Date(year, monthIndex, day);
      this.currentDate = dateObj.toISOString();
      
      // Limpiar selección visual
      this.selectedDay.isSelected = false;
      this.selectedDay = null;
    }
  }
  
  // Abrir modal de hora de salida
  openExitTimeModal() {
    this.exitTimeModal.present();
  }
  
  // Cuando se selecciona hora de salida en el modal
  onExitTimeChange(event: any) {
    const selectedTime = event.detail.value;
    if (selectedTime) {
      // Formatear la hora para mostrar (ej: "18:30")
      const date = new Date(selectedTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      this.exitTime = `${hours}:${minutes}`;
      this.exitTimeValue = selectedTime;
    }
    this.exitTimeModal.dismiss();
  }
  
  // Cuando se selecciona fecha de llegada desde el datetime-button
  onDateChange(event: any) {
    const selectedDate = event.detail.value;
    if (selectedDate) {
      const date = new Date(selectedDate);
      const day = date.getDate();
      const month = this.monthNames[date.getMonth()];
      const year = date.getFullYear();
      this.selectedDate = `${day} ${month} ${year}`;
      this.currentDate = selectedDate;
    }
  }
  
  // Cuando se selecciona hora de llegada desde el datetime-button
  onTimeChange(event: any) {
    const selectedTime = event.detail.value;
    if (selectedTime) {
      const date = new Date(selectedTime);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      this.selectedTime = `${hours}:${minutes}`;
      this.currentTime = selectedTime;
    }
  }
  
  // Navegar entre meses
  prevMonth() {
    const currentMonthIndex = this.monthNames.indexOf(this.currentMonth);
    let newMonthIndex = currentMonthIndex - 1;
    let newYear = this.currentYear;
    
    if (newMonthIndex < 0) {
      newMonthIndex = 11;
      newYear--;
    }
    
    this.currentMonth = this.monthNames[newMonthIndex];
    this.currentYear = newYear;
    this.generateCalendar();
  }
  
  nextMonth() {
    const currentMonthIndex = this.monthNames.indexOf(this.currentMonth);
    let newMonthIndex = currentMonthIndex + 1;
    let newYear = this.currentYear;
    
    if (newMonthIndex > 11) {
      newMonthIndex = 0;
      newYear++;
    }
    
    this.currentMonth = this.monthNames[newMonthIndex];
    this.currentYear = newYear;
    this.generateCalendar();
  }
  
  // Confirmar reserva
  confirmarReserva() {
    if (!this.selectedDate) {
      console.log('❌ Por favor selecciona una fecha');
      return;
    }
    
    if (!this.selectedTime) {
      console.log('❌ Por favor selecciona una hora de llegada');
      return;
    }
    
    if (!this.numeroPersonas) {
      console.log('❌ Por favor selecciona el número de personas');
      return;
    }
    
    const reserva = {
      fecha: this.selectedDate,
      horaLlegada: this.selectedTime,
      horaSalida: this.exitTime || 'No especificada',
      personas: this.numeroPersonas
    };
    
    console.log('✅ Reserva confirmada:', reserva);
    // Aquí puedes agregar la lógica para guardar la reserva
  }
}