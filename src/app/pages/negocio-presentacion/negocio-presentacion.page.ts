import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, ToastController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  personCircleOutline, 
  imageOutline, 
  pencilOutline, 
  trashOutline, 
  add, 
  storefrontOutline 
} from 'ionicons/icons';

interface Negocio {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen?: string;
}

@Component({
  selector: 'app-negocio-presentacion',
  templateUrl: './negocio-presentacion.page.html',
  styleUrls: ['./negocio-presentacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule] 
})
export class NegocioPresentacionPage implements OnInit {

  misNegocios: Negocio[] = [
    { id: 1, nombre: 'Café Guayaba Real', categoria: 'Cafetería', descripcion: 'El aroma tradicional de Calvillo en tu mesa.' },
    { id: 2, nombre: 'Deshilados "La Original"', categoria: 'Artesanías', descripcion: 'Prendas únicas con técnica artesanal de la región.' }
  ];

  constructor(
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    addIcons({ 
      personCircleOutline, 
      imageOutline, 
      pencilOutline, 
      trashOutline, 
      add, 
      storefrontOutline 
    });
  }

  ngOnInit() { }

  irANegocioInicio() {
    this.navCtrl.navigateForward('/negocio-inicio');
  }

  irAPerfil() {
    this.navCtrl.navigateForward('/perfil');
  }

  editarNegocio(negocio: Negocio) {
    this.presentToast(`Editando: ${negocio.nombre}`, 'primary');
  }

  async borrarNegocio(negocio: Negocio) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar negocio?',
      message: `¿Estás seguro de borrar "${negocio.nombre}"?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Borrar',
          handler: () => {
            this.misNegocios = this.misNegocios.filter(n => n.id !== negocio.id);
            this.presentToast('Negocio eliminado', 'danger');
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: color });
    toast.present();
  }
}