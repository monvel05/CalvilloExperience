import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';

@Component({
  selector: 'app-turista-inicio',
  templateUrl: './turista-inicio.page.html',
  styleUrls: ['./turista-inicio.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule]
})
export class TuristaInicioPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
