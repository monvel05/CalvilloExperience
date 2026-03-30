import { Component, ViewChild, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { 
  NavController, 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonButtons, 
  IonAvatar, 
  IonIcon, 
  IonContent 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { personCircle } from 'ionicons/icons';

@Component({
  selector: 'app-turista-inicio',
  templateUrl: './turista-inicio.page.html',
  styleUrls: ['./turista-inicio.page.scss'],
  standalone: true,
  imports: [
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonAvatar, 
    IonIcon, 
    IonContent
  
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TuristaInicioPage {
  @ViewChild(IonContent) content!: IonContent;

  categoriaSeleccionada: string = 'todos';
  dropdownAbierto: boolean = false;
  
  // Mapeo de categorías a nombres e iconos
  private categoriasMap: { [key: string]: { nombre: string, icono: string } } = {
    'todos': { nombre: 'Todos', icono: 'apps-outline' },
    'restaurantes': { nombre: 'Restaurantes', icono: 'restaurant-outline' },
    'artesanos': { nombre: 'Artesanos', icono: 'color-palette-outline' },
    'hospedaje': { nombre: 'Hospedaje', icono: 'bed-outline' },
    'atractivos': { nombre: 'Atractivos', icono: 'map-outline' },
    'transporte': { nombre: 'Transporte', icono: 'car-outline' }
  };

  constructor(private navCtrl: NavController) {
    addIcons({ personCircle });
  }

  get categoriaNombre(): string {
    return this.categoriasMap[this.categoriaSeleccionada]?.nombre || 'Todos';
  }

  get categoriaIcono(): string {
    return this.categoriasMap[this.categoriaSeleccionada]?.icono || 'apps-outline';
  }

  toggleDropdown() {
    this.dropdownAbierto = !this.dropdownAbierto;
  }

  seleccionarCategoria(categoriaId: string) {
    this.categoriaSeleccionada = categoriaId;
    this.dropdownAbierto = false;
    
    // Scroll suave hacia la sección de negocios
    setTimeout(() => {
      const element = document.querySelector('.negocios-section:not(.hidden)');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }

  verTodos() {
    this.seleccionarCategoria('todos');
  }

  irANegocio(id: number) {
    this.navCtrl.navigateForward(`/info-negocio/${id}`);
  }

  irAPerfil() {
    this.navCtrl.navigateForward('/perfil');
  }

  scrollToTop() {
    this.content.scrollToTop(500);
  }

  // Cerrar dropdown al hacer scroll
  onScroll() {
    if (this.dropdownAbierto) {
      this.dropdownAbierto = false;
    }
  }
}