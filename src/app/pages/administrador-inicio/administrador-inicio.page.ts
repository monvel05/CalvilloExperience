import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-administrador-inicio',
  templateUrl: './administrador-inicio.page.html',
  styleUrls: ['./administrador-inicio.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class AdministradorInicioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
