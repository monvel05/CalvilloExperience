import { Component, OnInit } from '@angular/core';
import { CloudinaryService } from '../../services/cloudinary-service';

@Component({
  selector: 'app-muro-social',
  templateUrl: './muro-social.page.html',
  styleUrls: ['./muro-social.page.scss'],
})
export class MuroSocial implements OnInit {

  publicaciones: any[] = [];
  idUsuario = 2;

  constructor(private cloudinary: CloudinaryService) {}

  ngOnInit() {
    // Registrar funciones globales para que funcionen los onclick del HTML inyectado
    (window as any).darLike = (id: number) => this.darLike(id);
    (window as any).publicar = () => this.publicar();
    (window as any).eliminarPublicacion = (id: number) => this.eliminarPublicacion(id);
  }

  // Se ejecuta siempre al entrar a la pestaña
  ionViewWillEnter() {
    this.cargarPublicaciones();
  }

  async cargarPublicaciones() {
    try {
      const response = await fetch("http://localhost:3000/api/publicaciones");
      const data = await response.json();
      this.publicaciones = data;

      // Esperar un momento a que el DOM esté listo antes de renderizar
      setTimeout(() => this.renderPublicaciones(), 100);
    } catch (error) {
      console.error("Error cargando posts", error);
    }
  }

  renderPublicaciones() {
    const contenedor: any = document.getElementById("contenedorPublicaciones");
    if (!contenedor) return;

    contenedor.innerHTML = "";

    this.publicaciones.forEach(pub => {
      const tarjeta = document.createElement("div");
      tarjeta.className = "publicacion";

      const fotoHTML = pub.foto ? `<div class="contenedor-foto"><img src="${pub.foto}"></div>` : "";

      tarjeta.innerHTML = `
        <div class="header">
          <div class="avatar"></div>
          <div class="info">
            <span class="nombre">${pub.nombre || 'Explorador'}</span>
            <span class="fecha">${pub.fecha || 'Reciente'}</span>
          </div>
        </div>
        ${fotoHTML}
        <div class="contenido-texto">
          <p class="descripcion"><strong>${pub.nombre || 'Usuario'}</strong> ${pub.descripcion}</p>
        </div>
        <div class="acciones">
          <button class="like-btn" onclick="darLike(${pub.idPublicacion})">
            <span>❤️</span> 
            <span class="count">${pub.likes || 0}</span>
          </button>
          <button class="delete-btn" onclick="eliminarPublicacion(${pub.idPublicacion})">
            <span class="icon-delete">🗑️</span>
          </button>
        </div>
      `;
      contenedor.appendChild(tarjeta);
    });
  }

  async darLike(id: number) {
    await fetch(`http://localhost:3000/api/publicaciones/${id}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idUsuario: this.idUsuario })
    });
    this.cargarPublicaciones();
  }

  async eliminarPublicacion(id: number) {
    if (!confirm("¿Eliminar publicación?")) return;
    await fetch(`http://localhost:3000/api/publicaciones/${id}`, { method: "DELETE" });
    this.cargarPublicaciones();
  }

  async publicar() {
    const txt: any = document.getElementById("descripcionPublicacion");
    const img: any = document.getElementById("imagenPublicacion");
    const btn: any = document.querySelector(".btn-publicar");

    if (!txt.value.trim()) return alert("Escribe algo primero");

    try {
      btn.innerText = "Cargando...";
      btn.disabled = true;

      let linkFoto = null;
      if (img.files[0]) {
        const res: any = await this.cloudinary.uploadImage(img.files[0]);
        linkFoto = res.secure_url;
      }

      await fetch("http://localhost:3000/api/publicaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          descripcion: txt.value,
          idUsuario: this.idUsuario,
          idNegocio: 1,
          linkFoto: linkFoto
        })
      });

      txt.value = "";
      img.value = "";
      this.cargarPublicaciones();
    } catch (e) {
      alert("Error al publicar");
    } finally {
      btn.innerText = "Publicar";
      btn.disabled = false;
    }
  }
}