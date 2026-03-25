import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CloudinaryService } from '../../core/services/cloudinary-service';
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
  imports: [IonicModule, CommonModule, FormsModule]
})
export class MuroSocial implements OnInit {

  // --- VARIABLES ---
  publicaciones: any[] = [];
  nombreArchivo: string = '';
  // Ojo: En tu base de datos, el idUsuario 6 corresponde a "Admin"
  idUsuario = 6; 

  // --- CONSTRUCTOR ---
  constructor(
    private cloudinary: CloudinaryService,
    private router: Router
  ) {
    // Registramos todos los íconos que usamos en el HTML del muro
    addIcons({
      'arrow-back-outline': arrowBackOutline,
      'image-outline': imageOutline,
      'paper-plane-outline': paperPlaneOutline,
      'heart': heart,
      'trash-outline': trashOutline,
      'images-outline': imagesOutline
    });
  }

  // --- CICLO DE VIDA DE ANGULAR ---
  ngOnInit() {
    // La inicialización queda limpia, Angular maneja los eventos ahora
  }

  // Se ejecuta cada vez que entras a la pestaña
  ionViewWillEnter() {
    this.cargarPublicaciones();
  }

  // --- FUNCIONES DEL MURO SOCIAL ---
  async cargarPublicaciones() {
    try {
      const response = await fetch("http://localhost:3000/api/publicaciones");
      const data = await response.json();
      this.publicaciones = data;
    } catch (error) {
      console.error("Error cargando posts", error);
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.nombreArchivo = file.name; // Guardamos el nombre de la imagen
    } else {
      this.nombreArchivo = ''; // Si cancela, lo dejamos en blanco
    }
  }

  async darLike(id: number) {
    try {
      await fetch(`http://localhost:3000/api/publicaciones/${id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idUsuario: this.idUsuario })
      });
      this.cargarPublicaciones();
    } catch (error) {
      console.error("Error al dar like", error);
    }
  }

  async eliminarPublicacion(id: number) {
    if (!confirm("¿Estás seguro de que deseas eliminar esta publicación?")) return;
    
    try {
      await fetch(`http://localhost:3000/api/publicaciones/${id}`, { method: "DELETE" });
      this.cargarPublicaciones();
    } catch (error) {
      console.error("Error al eliminar", error);
    }
  }

  // Recibimos los elementos HTML directamente gracias a las variables de plantilla (#)
  async publicar(txtInput: HTMLTextAreaElement, imgInput: HTMLInputElement) {
    const descripcion = txtInput.value;

    if (!descripcion.trim()) {
      alert("Por favor, escribe algo antes de publicar.");
      return;
    }

    try {
      let linkFoto = null;
      
      // Si el usuario seleccionó una imagen, la subimos a Cloudinary primero
      if (imgInput.files && imgInput.files[0]) {
        const res: any = await this.cloudinary.uploadImage(imgInput.files[0]);
        linkFoto = res.secure_url;
      }

      // Guardamos la publicación en la base de datos
      await fetch("http://localhost:3000/api/publicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: descripcion,
          idUsuario: this.idUsuario,
          idNegocio: 1, // Por ahora está fijo en 1, puedes hacerlo dinámico después
          linkFoto: linkFoto
        })
      });

      // Limpiamos los campos del formulario después de publicar con éxito
      txtInput.value = "";
      imgInput.value = "";
      this.nombreArchivo = "";
      
      // Recargamos el muro para ver la nueva publicación
      this.cargarPublicaciones();
      
    } catch (e) {
      console.error(e);
      alert("Hubo un error al intentar publicar. Inténtalo de nuevo.");
    }
  }

  regresarAdmin() {
    // Te regresa al panel de administrador
    this.router.navigate(['/administrador-inicio']);
  }
}