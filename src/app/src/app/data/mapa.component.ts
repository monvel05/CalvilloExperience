import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class MapaComponent implements OnInit {
  googleMapsApiKey = environment.apiKey;

  constructor() {}

  ngOnInit() {
    console.log('Mapa de Calvillo configurado con la clave:', this.googleMapsApiKey);
  }
}