import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, NavController } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { 
  personCircleOutline, mapOutline, chatbubblesOutline, logOutOutline, 
  star, searchOutline 
} from 'ionicons/icons';

// Importamos los servicios reales
import { NegocioService } from '../../core/services/negocio.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DatosNegocio } from '../../shared/interfaces/datos-negocio';

@Component({
  selector: 'app-turista-inicio',
  templateUrl: './turista-inicio.page.html',
  styleUrls: ['./turista-inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, TranslateModule]
})
export class TuristaInicioPage implements OnInit {
  
  // Inyección de dependencias
  private negocioService = inject(NegocioService);
  private authService = inject(AuthService);
  private navCtrl = inject(NavController);

  // Estados de la vista
  negocios: DatosNegocio[] = [];
  negociosFiltrados: DatosNegocio[] = [];
  cargando = true;
  categoriaSeleccionada = 'todos';

  constructor() {
    addIcons({ 
      personCircleOutline, mapOutline, chatbubblesOutline, logOutOutline, star, searchOutline 
    });
  }

  ngOnInit() {
    this.cargarNegociosBaseDatos();
  }

  cargarNegociosBaseDatos() {
    this.negocioService.obtenerTodos().subscribe({
      next: (data) => {
        this.negocios = data;
        this.negociosFiltrados = data; 
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error de conexión:', err);
        this.cargando = false;
      }
    });
  }

  filtrarCategoria(event: any) {
    this.categoriaSeleccionada = event.detail.value;
    
    if (this.categoriaSeleccionada === 'todos') {
      this.negociosFiltrados = this.negocios;
    } else {
      this.negociosFiltrados = this.negocios.filter(
        n => n.categoria?.toLowerCase() === this.categoriaSeleccionada.toLowerCase()
      );
    }
  }

  // ==========================================
  // NAVEGACIÓN Y BOTONES DEL NAVBAR
  // ==========================================
  irANegocio(id: number) {
    this.navCtrl.navigateForward(`/info-negocio/${id}`);
  }

  irAMuro() {
    this.navCtrl.navigateForward('/muro-social');
  }

  irAMapa() {
    this.navCtrl.navigateForward('/mapa');
  }

  irAPerfil() {
    this.navCtrl.navigateForward('/perfil');
  }

  logout() {
    this.authService.logout();
  }
}