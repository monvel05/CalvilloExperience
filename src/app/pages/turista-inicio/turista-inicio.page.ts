import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButton, IonIcon, IonCard, IonCardContent, 
  IonGrid, IonRow, IonCol, IonBadge 
} from '@ionic/angular/standalone';
import { TrackingService } from 'src/app/core/services/tracking-service';
import { Router } from 'express';

@Component({
  selector: 'app-turista-inicio',
  templateUrl: './turista-inicio.page.html',
  styleUrls: ['./turista-inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonContent, 
    IonHeader, 
    IonTitle, 
    IonToolbar, 
    IonButton, 
    IonIcon, 
    IonCard, 
    IonCardContent, 
    IonGrid, 
    IonRow, 
    IonCol,
    IonBadge
  ]
})
export class TuristaInicioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  // Funcion para la barra de busqueda, se ejecuta cada vez que el turista escribe algo
  onBuscar(evento: any) {
    const termino = evento.target.value;
    if (termino) {
      this.trackingService.registrarEvento('BUSQUEDA_TURISTA', { termino_busqueda: termino });
    }
  }

  // Funcion para cuando el turista hace click en un negocio, se ejecuta cada vez que el turista hace click en un negocio
  verDetalles(idNegocio: number, nombreNegocio: string) {
    this.trackingService.registrarEvento('CLICK_VER_NEGOCIO', { 
      id_negocio: idNegocio, 
      nombre: nombreNegocio 
    });
    
    // Redireccionar a la página de detalles del negocio
    this.router.navigate(['/info-negocio', idNegocio]);
  }
  irAlMapa() {
    this.router.navigate(['/mapa']);
  }

  irACenadurias() {
    this.router.navigate(['/cenadurias']);
  }

  irAComidaRapida() {
    this.router.navigate(['/comida-rapida']);
  }

  irAHospedaje() {
    this.router.navigate(['/hospedaje']);
  }

  irAAtractivos() {
    this.router.navigate(['/atractivos']);
  }

  irAlLogin() {
    this.router.navigate(['/login']);
  }
}