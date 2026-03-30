import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, 
  IonIcon, IonList, IonItem, IonInput, IonRow, IonCol, 
  IonRadioGroup, IonRadio, IonLabel, IonSelect, IonSelectOption 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { personCircleOutline } from 'ionicons/icons';

@Component({
  selector: 'app-turista-perfil',
  templateUrl: './turista-perfil.page.html',
  styleUrls: ['./turista-perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonTitle, IonToolbar, 
    IonButtons, IonBackButton, IonIcon, IonList, IonItem, IonInput, 
    IonRow, IonCol, IonRadioGroup, IonRadio, IonLabel, IonSelect, IonSelectOption
  ]
})
export class TuristaPerfilPage implements OnInit {

  constructor() { 
    // Registramos el icono para que se vea correctamente
    addIcons({ personCircleOutline });
  }

  ngOnInit() {
  }

}