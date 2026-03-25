import { Component, OnInit, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TrackingService } from 'src/app/core/services/tracking-service';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MapaComponent implements OnInit {
  private trackingService = inject(TrackingService);

  @Input() centro = { lat: 21.8467, lng: -102.7187 };

  constructor() { }

  ngOnInit() {
    console.log('Mapa de Calvillo Experience cargado');
  }

  cambiarCategoria(event: any) {
    const categoria = event.detail.value;
    console.log('Filtrando mapa por:', categoria);
  }

  // Función de telemetría para registrar interacción con el mapa
  alTocarPin(idNegocio: number, nombreNegocio: string) {
    this.trackingService.registrarEvento('INTERACCION_MAPA', { 
      accion: 'Tocar Pin',
      id_negocio: idNegocio,
      nombre: nombreNegocio
    });
  }
}