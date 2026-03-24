import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, 
  IonButton, IonIcon, IonCard, IonCardContent, 
  IonGrid, IonRow, IonCol, IonBadge 
} from '@ionic/angular/standalone';

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
  
  constructor(private router: Router) { }

  ngOnInit() {
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