import { Component, ViewChild, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavController } from '@ionic/angular';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonAvatar, 
  IonIcon, IonContent, IonCard, IonCardHeader, IonCardTitle, 
  IonCardSubtitle, IonCardContent, IonImg, IonFab, IonFabButton,
  IonSpinner, IonButton // <-- Importamos IonButton para el Navbar
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons'; 
import { 
  personCircle, appsOutline, restaurantOutline, colorPaletteOutline, 
  bedOutline, mapOutline, carOutline, chevronDownOutline, chevronUpOutline,
  star, locationOutline, timeOutline, arrowUpOutline, gridOutline, pricetagOutline,
  logOutOutline // <-- Nuevo icono de Logout
} from 'ionicons/icons';

import { NegocioService } from '../../core/services/negocio.service';
import { AuthService } from 'src/app/core/services/auth.service'; // <-- Importamos el AuthService
import { DatosNegocio } from '../../shared/interfaces/datos-negocio';
import { TranslateModule } from '@ngx-translate/core';

interface CategoriaMenu {
  id: string;
  nombre: string;
  icono: string;
}

@Component({
  selector: 'app-turista-inicio',
  templateUrl: './turista-inicio.page.html',
  styleUrls: ['./turista-inicio.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonAvatar, 
    IonIcon, 
    IonContent, 
    IonCard, 
    IonCardHeader, 
    IonCardTitle, 
    IonCardSubtitle, 
    IonCardContent, 
    IonImg, 
    IonFab, 
    IonFabButton,
    IonSpinner,
    IonButton // <-- Lo agregamos a los imports del template
  ]
})
export class TuristaInicioPage implements OnInit {
  @ViewChild(IonContent) content!: IonContent;

  private negocioService = inject(NegocioService);
  private authService = inject(AuthService); // <-- Inyectamos para el logout
  private navCtrl = inject(NavController);

  listaNegocios: DatosNegocio[] = [];
  negociosFiltrados: DatosNegocio[] = [];
  cargando = true;
  
  categoriasDisponibles: CategoriaMenu[] = [];
  categoriaSeleccionada: CategoriaMenu = { id: 'todos', nombre: 'Todos', icono: 'apps-outline' };
  dropdownAbierto = false;

  constructor() {
    // Agregamos logOutOutline a la lista de iconos registrados
    addIcons({
      personCircle, star, pricetagOutline, locationOutline, arrowUpOutline, appsOutline,
      restaurantOutline, colorPaletteOutline, bedOutline, mapOutline, carOutline,
      chevronDownOutline, chevronUpOutline, timeOutline, gridOutline, logOutOutline
    });
  }

  ngOnInit() {
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.negocioService.obtenerTodos().subscribe({
      next: (data) => {
        this.listaNegocios = data;
        this.negociosFiltrados = data;
        this.generarCategoriasDinamicas(data);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar negocios:', err);
        this.cargando = false;
      }
    });
  }

  generarCategoriasDinamicas(negocios: DatosNegocio[]) {
    const categoriasUnicas = new Set<string>();
    negocios.forEach(n => {
      if (n.categoria) categoriasUnicas.add(n.categoria);
    });

    const categoriasArray: CategoriaMenu[] = Array.from(categoriasUnicas).map(cat => ({
      id: cat.toLowerCase(),
      nombre: cat,
      icono: this.obtenerIconoParaCategoria(cat)
    }));

    categoriasArray.sort((a, b) => a.nombre.localeCompare(b.nombre));
    this.categoriasDisponibles = [
      { id: 'todos', nombre: 'Todos', icono: 'apps-outline' },
      ...categoriasArray
    ];
  }

  obtenerIconoParaCategoria(categoria: string): string {
    const catLower = categoria.toLowerCase();
    if (catLower.includes('gastronom') || catLower.includes('restauran') || catLower.includes('comida')) return 'restaurant-outline';
    if (catLower.includes('hospedaje') || catLower.includes('hotel')) return 'bed-outline';
    if (catLower.includes('artesan')) return 'color-palette-outline';
    if (catLower.includes('transporte')) return 'car-outline';
    if (catLower.includes('atractivo') || catLower.includes('lugar')) return 'map-outline';
    return 'grid-outline'; 
  }

  toggleDropdown() {
    this.dropdownAbierto = !this.dropdownAbierto;
  }

  seleccionarCategoria(cat: CategoriaMenu) {
    this.categoriaSeleccionada = cat;
    this.dropdownAbierto = false;
    
    if (cat.id === 'todos') {
      this.negociosFiltrados = this.listaNegocios;
    } else {
      this.negociosFiltrados = this.listaNegocios.filter(n => n.categoria === cat.nombre);
    }
  }

  // --- NUEVAS FUNCIONES DE NAVEGACIÓN ---

  irANegocio(id: number) {
    // Viajamos a InfoNegocio pasando el ID del negocio en la URL
    this.navCtrl.navigateForward(`/info-negocio/${id}`);
  }

  irAPerfil() {
    this.navCtrl.navigateForward('/perfil');
  }

  irAMapaGlobal() {
    this.navCtrl.navigateForward('/mapa');
  }

  logout() {
    this.authService.logout(); // Usa la función que ya creaste en tu servicio
  }

  scrollToTop() {
    if (this.content) {
      this.content.scrollToTop(500);
    }
  }
}