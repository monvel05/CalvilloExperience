import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-negocio-inicio',
  templateUrl: './negocio-inicio.page.html',
  styleUrls: ['./negocio-inicio.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NegocioInicioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
