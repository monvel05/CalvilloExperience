import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { DatabaseService } from '../../core/services/database.service';

@Component({
  selector: 'app-negocio-inicio',
  templateUrl: './negocio-inicio.page.html',
  styleUrls: ['./negocio-inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule]
})
export class NegocioInicioPage implements OnInit {
  
  datosNegocio: any = {
    nombre: '',
    visitas: 0,
    contactos: 0,
    rating: 0,
    resenas: 0,
    promociones: 0
  };
  idUsuario: number = 1;

  constructor(
    private db: DatabaseService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.db.getPerfilNegocio(this.idUsuario).subscribe({
      next: (res: any) => {
        this.datosNegocio = res;
        console.log('¡Lo logramos¡:', res);
      },
      error: (err: any) => {
        console.error('Error al cargar datos:', err);
      }
    });
  }

  editarInformacion() {
    this.router.navigate(['/negocio-iniciao/editar']);
  }

  verGaleria() {
    this.router.navigate(['/negocio-iniciao/galeria']);
  }

  verResenas() {
    this.router.navigate(['/negocio-iniciao/resenas']);
  }

  verPromociones() {
    this.router.navigate(['/negocio-iniciao/promociones']);
  }

  agregarProducto() {
    this.router.navigate(['/negocio-iniciao/agregar-producto']);
  }

  cerrarSesion() {
    this.router.navigate(['/login']);
  }
}