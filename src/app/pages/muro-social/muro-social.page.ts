import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons,      
  IonBackButton,    
  IonButton, 
  IonIcon 
} from '@ionic/angular/standalone';

import { CloudinaryService } from '../../core/services/cloudinary-service';
import { MuroSocialService } from '../../core/services/muro-social.service';

import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  imageOutline, 
  paperPlaneOutline, 
  heart, 
  trashOutline,
  imagesOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-muro-social',
  templateUrl: './muro-social.page.html',
  styleUrls: ['./muro-social.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    IonContent, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons,      
    IonBackButton,    
    IonButton, 
    IonIcon
  ]
})
export class MuroSocial implements OnInit {

  publicaciones: any[] = [];
  nombreArchivo: string = '';
  idUsuario = 6;

  constructor(
    private cloudinary: CloudinaryService,
    private router: Router,
    private muroService: MuroSocialService
  ) {
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'image-outline': imageOutline,
      'paper-plane-outline': paperPlaneOutline,
      'heart': heart,
      'trash-outline': trashOutline,
      'images-outline': imagesOutline
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.cargarPublicaciones();
  }

  // 📥 Cargar publicaciones
  async cargarPublicaciones() {
    try {
      this.publicaciones = await this.muroService.getPublicaciones();
    } catch (error) {
      console.error("Error cargando posts", error);
    }
  }

  // 📷 Detectar archivo
  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.nombreArchivo = file ? file.name : '';
  }

  // ❤️ Dar like
  async darLike(id: number) {
    try {
      await this.muroService.darLike(id, this.idUsuario);
      this.cargarPublicaciones();
    } catch (error) {
      console.error("Error al dar like", error);
    }
  }

  // 🗑 Eliminar publicación
  async eliminarPublicacion(id: number) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta publicación?")) return;

    try {
      await this.muroService.eliminarPublicacion(id);
      this.cargarPublicaciones();
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  }

  // 📤 Publicar
  async publicar(txtInput: HTMLTextAreaElement, imgInput: HTMLInputElement) {
    const descripcion = txtInput.value;

    if (!descripcion.trim()) {
      alert("Por favor, escribe algo antes de publicar.");
      return;
    }

    try {
      let linkFoto = null;

      // Subir imagen si existe
      if (imgInput.files && imgInput.files[0]) {
        const res: any = await this.cloudinary.uploadImage(imgInput.files[0]);
        linkFoto = res.secure_url;
      }

      // Guardar publicación
      await this.muroService.crearPublicacion({
        descripcion,
        idUsuario: this.idUsuario,
        idNegocio: 1,
        linkFoto
      });

      // Limpiar inputs
      txtInput.value = "";
      imgInput.value = "";
      this.nombreArchivo = "";

      // Recargar
      this.cargarPublicaciones();

    } catch (error) {
      console.error(error);
      alert("Hubo un error al publicar.");
    }
  }

  regresarAdmin() {
    this.router.navigate(['/administrador-inicio']);
  }
}