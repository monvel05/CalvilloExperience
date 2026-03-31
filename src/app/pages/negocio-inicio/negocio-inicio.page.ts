import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, 
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
  IonCardContent, IonFab, IonFabButton 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  personCircleOutline, imageOutline, pencilOutline, 
  trashOutline, add, storefrontOutline, addCircleOutline, logOutOutline // <-- Añadido logOutOutline
} from 'ionicons/icons';

interface Negocio {
  id: number;
  nombre: string;
  categoria: string;
  descripcion: string;
  imagen?: string;
}

@Component({
  selector: 'app-negocio-inicio',
  templateUrl: './negocio-inicio.page.html',
  styleUrls: ['./negocio-inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, 
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, 
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, 
    IonCardContent, IonFab, IonFabButton
  ] 
})
export class NegocioInicioPage implements OnInit {
  
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);

  misNegocios: Negocio[] = [
    { id: 1, nombre: 'Café Guayaba Real', categoria: 'Cafetería', descripcion: 'El aroma tradicional de Calvillo en tu mesa.', imagen: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=500' },
    { id: 2, nombre: 'Deshilados "La Original"', categoria: 'Artesanías', descripcion: 'Prendas únicas con técnica artesanal de la región.' }
  ];

  constructor() {
    // Registramos el nuevo ícono aquí
    addIcons({ personCircleOutline, imageOutline, pencilOutline, trashOutline, add, storefrontOutline, addCircleOutline, logOutOutline });
  }

  ngOnInit() { }

  irAFormularioNuevo() {
    this.navCtrl.navigateForward('/negocio-presentacion');
  }

  irAPerfil() {
    this.navCtrl.navigateForward('/perfil');
  }

  editarNegocio(negocio: Negocio) {
    // Mandamos los datos al formulario (negocio-presentacion)
    this.router.navigate(['/negocio-presentacion'], { state: { negocioData: negocio } });
  }

  async borrarNegocio(negocio: Negocio) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar negocio?',
      message: `¿Estás seguro de borrar "${negocio.nombre}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Borrar',
          role: 'destructive',
          handler: () => {
            this.misNegocios = this.misNegocios.filter(n => n.id !== negocio.id);
            this.presentToast('Negocio eliminado correctamente', 'danger');
          }
        }
      ]
    });
    await alert.present();
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro de que deseas salir?',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salir',
          role: 'destructive',
          handler: () => {
            // Aquí puedes limpiar tus variables de sesión o tokens si es necesario
            // localStorage.clear();
            
            // Redirigimos al usuario a la vista de login (asegúrate de que la ruta coincida con tu app)
            this.navCtrl.navigateRoot('/login'); 
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2500, color: color, position: 'bottom' });
    toast.present();
  }
}