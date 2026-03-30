import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-negocio-presentacion',
  templateUrl: './negocio-presentacion.page.html',
  styleUrls: ['./negocio-presentacion.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class NegocioPresentacionPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
