import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,      
  IonBackButton, IonButton, IonIcon, NavController, ToastController, AlertController
} from '@ionic/angular/standalone';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { CloudinaryService } from '../../core/services/cloudinary.service';
import { MuroSocialService } from '../../core/services/muro-social.service';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';

import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, imageOutline, paperPlaneOutline, 
  heart, trashOutline, imagesOutline, checkmarkCircle 
} from 'ionicons/icons';

@Component({
  selector: 'app-muro-social',
  templateUrl: './muro-social.page.html',
  styleUrls: ['./muro-social.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, IonToolbar, 
    IonTitle, IonButtons, IonBackButton, IonButton, IonIcon, TranslateModule
  ]
})
export class MuroSocial implements OnInit {
  publicaciones: any[] = [];
  nombreArchivo: string = '';
  usuario: DatosUsuario | null = null;

  // Inyección de dependencias moderna
  private cloudinary = inject(CloudinaryService);
  private navCtrl = inject(NavController);
  private muroService = inject(MuroSocialService);
  private translate = inject(TranslateService);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);

  constructor() {
    addIcons({imageOutline, checkmarkCircle, paperPlaneOutline, heart, trashOutline, imagesOutline, arrowBackOutline});
  }

  ngOnInit() {
    // Configuración del usuario y el idioma
    const usuarioStr = localStorage.getItem('user');
    if (usuarioStr) {
      this.usuario = JSON.parse(usuarioStr) as DatosUsuario;
      this.translate.use(this.usuario.idIdioma === 2 ? 'en' : 'es');
    } else {
      this.translate.use('es');
    }
  }

  ionViewWillEnter() {
    this.cargarPublicaciones();
  }

  async mostrarToast(mensaje: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  cargarPublicaciones() {
    // Uso del servicio refactorizado con Observables
    this.muroService.getPublicaciones().subscribe({
      next: (data) => this.publicaciones = data,
      error: (err) => console.error("Error cargando posts", err)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.nombreArchivo = file ? file.name : '';
  }

  darLike(id: number) {
    if (!this.usuario) return;
    this.muroService.darLike(id, this.usuario.idUsuario).subscribe({
      next: () => this.cargarPublicaciones(),
      error: (err) => console.error("Error al dar like", err)
    });
  }

  async eliminarPublicacion(id: number) {
    // Reemplazo del confirm() nativo por una alerta de Ionic para mejor UX
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('SOCIAL_WALL.DELETE_CONFIRM_TITLE'),
      message: this.translate.instant('SOCIAL_WALL.DELETE_CONFIRM_MSG'),
      buttons: [
        { text: this.translate.instant('SOCIAL_WALL.CANCEL'), role: 'cancel' },
        { 
          text: this.translate.instant('SOCIAL_WALL.DELETE'), 
          role: 'destructive',
          handler: () => {
            this.muroService.eliminarPublicacion(id).subscribe({
              next: () => this.cargarPublicaciones(),
              error: (err) => console.error("Error al eliminar", err)
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async publicar(txtInput: HTMLTextAreaElement, imgInput: HTMLInputElement) {
    const descripcion = txtInput.value;

    if (!descripcion.trim()) {
      this.mostrarToast(this.translate.instant('SOCIAL_WALL.ALERT_EMPTY_POST'), 'warning');
      return;
    }

    if (!this.usuario) {
      this.mostrarToast('Error de sesión. Por favor inicia sesión de nuevo.', 'danger');
      return;
    }

    try {
      let linkFoto = null;

      // La subida a Cloudinary sí se mantiene con await
      if (imgInput.files && imgInput.files[0]) {
        const res: any = await this.cloudinary.uploadImage(imgInput.files[0]);
        linkFoto = res.secure_url;
      }

      const nuevaPub = {
        descripcion,
        idUsuario: this.usuario.idUsuario,
        idNegocio: null, 
        linkFoto
      };

      this.muroService.crearPublicacion(nuevaPub).subscribe({
        next: () => {
          txtInput.value = "";
          imgInput.value = "";
          this.nombreArchivo = "";
          this.cargarPublicaciones();
        },
        error: (err) => {
          console.error(err);
          this.mostrarToast(this.translate.instant('SOCIAL_WALL.ERROR_PUBLISH'));
        }
      });

    } catch (error) {
      console.error(error);
      this.mostrarToast(this.translate.instant('SOCIAL_WALL.ERROR_PUBLISH'));
    }
  }
}