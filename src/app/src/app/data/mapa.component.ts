import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MapaComponent implements OnInit {

  @Input() centro = { lat: 21.8467, lng: -102.7187 };

  constructor() { }

  ngOnInit() {
    console.log('Mapa de Calvillo Experience cargado');
  }

  cambiarCategoria(event: any) {
    const categoria = event.detail.value;
    console.log('Filtrando mapa por:', categoria);
  }
}