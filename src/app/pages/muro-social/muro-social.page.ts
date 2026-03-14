import { Component, OnInit } from '@angular/core';
import { CloudinaryService } from '../../services/cloudinary-service';

@Component({
  selector: 'app-muro-social',
  templateUrl: './muro-social.page.html',
  styleUrls: ['./muro-social.page.scss'],
})

export class MuroSocial implements OnInit {

  publicaciones:any[] = [];
  idUsuario = 2;

  constructor(private cloudinary: CloudinaryService){}

  ngOnInit(){

    (window as any).darLike = (id:number)=>this.darLike(id);
    (window as any).abrirModal = ()=>this.abrirModal();
    (window as any).cerrarModal = ()=>this.cerrarModal();
    (window as any).publicar = ()=>this.publicar();
    (window as any).eliminarPublicacion = (id:number)=>this.eliminarPublicacion(id);

    this.cargarPublicaciones();

  }

  async cargarPublicaciones(){

    const response = await fetch("http://localhost:3000/api/publicaciones");
    const data = await response.json();

    this.publicaciones = data;

    this.renderPublicaciones();

  }

  renderPublicaciones(){

    const contenedor:any = document.getElementById("contenedorPublicaciones");

    contenedor.innerHTML = "";

    this.publicaciones.forEach(pub=>{

      let imagenHTML = "";

      if(pub.foto){
        imagenHTML = `<img class="imagen" src="${pub.foto}">`;
      }

      const tarjeta = document.createElement("div");

      tarjeta.className = "publicacion";

      tarjeta.innerHTML = `

      <div class="header">

        <div class="avatar"></div>

        <div class="info">
          <h3>${pub.nombre}</h3>
          <p class="fecha">${pub.fecha}</p>
        </div>

      </div>

      ${imagenHTML}

      <p class="descripcion">${pub.descripcion}</p>

      <div class="acciones">

        <button class="like-btn" onclick="darLike(${pub.idPublicacion})">
          ❤️ ${pub.likes}
        </button>

        <button class="delete-btn" onclick="eliminarPublicacion(${pub.idPublicacion})">
          🗑
        </button>

      </div>

      `;

      contenedor.appendChild(tarjeta);

    });

  }

  async darLike(id:number){

    await fetch(`http://localhost:3000/api/publicaciones/${id}/like`,{

      method:"POST",

      headers:{
        "Content-Type":"application/json"
      },

      body:JSON.stringify({
        idUsuario:this.idUsuario
      })

    });

    this.cargarPublicaciones();

  }

  async eliminarPublicacion(id:number){

    if(!confirm("¿Eliminar publicación?")) return;

    await fetch(`http://localhost:3000/api/publicaciones/${id}`,{
      method:"DELETE"
    });

    this.cargarPublicaciones();

  }

  abrirModal(){
    document.getElementById("modalPublicacion")!.style.display="flex";
  }

  cerrarModal(){
    document.getElementById("modalPublicacion")!.style.display="none";
  }

  async publicar(){

    const textarea:any = document.getElementById("descripcionPublicacion");
    const inputImagen:any = document.getElementById("imagenPublicacion");

    const descripcion = textarea.value;
    const imagen = inputImagen.files[0];

    if(!descripcion){
      alert("Escribe una descripción");
      return;
    }

    let linkFoto = null;

    try{

      if(imagen){

        const response:any = await this.cloudinary.uploadImage(imagen);

        linkFoto = response.secure_url;

      }

      await fetch("http://localhost:3000/api/publicaciones",{

        method:"POST",

        headers:{
          "Content-Type":"application/json"
        },

        body:JSON.stringify({

          descripcion:descripcion,
          idUsuario:this.idUsuario,
          idNegocio:1,
          linkFoto:linkFoto

        })

      });

      textarea.value="";
      inputImagen.value="";

      this.cerrarModal();

      this.cargarPublicaciones();

    }catch(error){

      console.error(error);
      alert("Error al publicar");

    }

  }

}