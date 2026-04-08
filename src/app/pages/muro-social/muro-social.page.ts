import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonContent, IonHeader, IonToolbar, IonTitle, IonButtons,      
  IonBackButton, IonButton, IonIcon, NavController 
} from '@ionic/angular/standalone';

// Importamos tus servicios
import { CloudinaryService } from '../../core/services/cloudinary-service';
import { MuroSocialService } from '../../core/services/muro-social.service';
import { AuthService } from '../../core/services/auth.service'; 

// Importamos la interfaz (ajusta la ruta si te marca error)
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario'; 

import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, imageOutline, paperPlaneOutline, heart, trashOutline,
  imagesOutline, checkmarkCircle 
} from 'ionicons/icons';

@Component({
  selector: 'app-muro-social',
  templateUrl: './muro-social.page.html',
  styleUrls: ['./muro-social.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, IonContent, IonHeader, 
    IonToolbar, IonTitle, IonButtons, IonBackButton, 
    IonButton, IonIcon
  ]
})
export class MuroSocial implements OnInit {

  // ==========================================
  // 📦 VARIABLES
  // ==========================================
  publicaciones: any[] = [];
  nombreArchivo: string = '';
  
  // Variables dinámicas del usuario
  usuarioActual: DatosUsuario | null = null;
  idUsuario: number = 0;
  esAdmin: boolean = false; // <--- Aquí está declarada para que el HTML no marque error

  constructor(
    private cloudinary: CloudinaryService,
    private navCtrl: NavController,
    private muroService: MuroSocialService,
    private authService: AuthService
  ) {
    addIcons({imageOutline,checkmarkCircle,paperPlaneOutline,heart,trashOutline,imagesOutline,'arrowBackOutline':arrowBackOutline});
  }

  ngOnInit() {
    this.obtenerUsuarioLogueado();
  }

  ionViewWillEnter() {
    this.cargarPublicaciones();
  }

  // ==========================================
  // 🔐 AUTENTICACIÓN DINÁMICA
  // ==========================================
  obtenerUsuarioLogueado() {
    this.usuarioActual = this.authService.getUser();
    
    if (this.usuarioActual) {
      this.idUsuario = this.usuarioActual.idUsuario; 
      
      // Validamos si es admin usando el idTipoUsuario de tu base de datos (1 = Administrador)
      this.esAdmin = (this.usuarioActual as any).idTipoUsuario === 1; 
    }
  }

  // ==========================================
  // 🧭 NAVEGACIÓN
  // ==========================================
  regresarAdmin() {
    this.navCtrl.navigateRoot('/administrador-inicio');
  }

  // ==========================================
  // 📱 FUNCIONES DEL MURO SOCIAL
  // ==========================================
  async cargarPublicaciones() {
    try {
      this.publicaciones = await this.muroService.getPublicaciones();
    } catch (error) {
      console.error("Error cargando posts", error);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.nombreArchivo = file ? file.name : '';
  }

  async darLike(id: number) {
    if (!this.idUsuario) {
      alert("Debes iniciar sesión para dar like.");
      return; 
    }
    try {
      await this.muroService.darLike(id, this.idUsuario);
      this.cargarPublicaciones();
    } catch (error) {
      console.error("Error al dar like", error);
    }
  }

  async eliminarPublicacion(id: number) {
    if (!this.esAdmin) {
      alert("No tienes permisos para eliminar publicaciones.");
      return;
    }

    if (!confirm("¿Estás seguro de que deseas eliminar esta publicación?")) return;

    try {
      await this.muroService.eliminarPublicacion(id);
      this.cargarPublicaciones();
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  }

  async publicar(txtInput: HTMLTextAreaElement, imgInput: HTMLInputElement) {
    const descripcion = txtInput.value;

    if (!descripcion.trim()) {
      alert("Por favor, escribe algo antes de publicar.");
      return;
    }

    if (!this.idUsuario) {
      alert("Debes iniciar sesión para publicar.");
      return;
    }

    try {
      let linkFoto = null;

      if (imgInput.files && imgInput.files[0]) {
        const res: any = await this.cloudinary.uploadImage(imgInput.files[0]);
        linkFoto = res.secure_url;
      }

      await this.muroService.crearPublicacion({
        descripcion,
        idUsuario: this.idUsuario, 
        idNegocio: 1, 
        linkFoto
      });

      txtInput.value = "";
      imgInput.value = "";
      this.nombreArchivo = "";

      this.cargarPublicaciones();

    } catch (error) {
      console.error(error);
      alert("Hubo un error al publicar.");
    }
  }
}