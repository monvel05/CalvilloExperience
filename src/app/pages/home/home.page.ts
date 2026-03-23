import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapaComponent } from '../../shared/components/mapa.component';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonicModule, MapaComponent], 
})
export class HomePage {
  constructor() {}
}