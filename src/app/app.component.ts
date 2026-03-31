import { Component, inject, OnInit } from '@angular/core'; // <-- 1. Agregamos OnInit
import { IonApp, IonRouterOutlet, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';

// <-- 2. Importamos tu archivo de environments (verifica que la ruta sea correcta para tu proyecto)
import { environment } from 'src/env/env';
import { TrackingService } from './core/services/tracking.service';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonLabel, IonIcon, IonTabButton, IonTabBar, IonTabs, IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit { // <-- 3. Implementamos la interfaz OnInit
  // Inyectamos servicios
  private translate = inject(TranslateService);
  private trackingService = inject(TrackingService);
  private router = inject(Router)

  constructor() {
    // 1. Definimos los idiomas que soporta la app
    this.translate.addLangs(['es', 'en']);
    
    // 2. Establecemos explícitamente el idioma de respaldo (fallback)
    // Esto evita que devuelva 'null' internamente en la librería
    this.translate.setFallbackLang('es');
    
    // 3. Revisamos si el usuario ya tenía un idioma guardado previamente
    const idiomaGuardado = localStorage.getItem('idiomaPreferido');
    
    if (idiomaGuardado) {
      // Si ya tiene uno guardado, usamos ese
      this.translate.use(idiomaGuardado);
    } else {
      // Si es su primera vez, usamos explícitamente 'es' para evitar el error de tipos
      this.translate.use('es');
    }

    // TRACKING AUTOMÁTICO DE VISTAS DE PÁGINA
    this.router.events.pipe(
      // Filtramos para que solo reaccione cuando la navegación ha terminado con éxito
      filter((event: any) => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Registramos la URL exacta que el turista acaba de abrir
      this.trackingService.registrarEvento('PAGE_VIEW', { ruta: event.urlAfterRedirects });
    });
  }

  // 4. Usamos el ciclo de vida ngOnInit para disparar la carga del mapa
  ngOnInit() {
    this.cargarGoogleMaps();
  }

  // 5. Creamos la función que inyecta el script dinámicamente
  private cargarGoogleMaps() {
    // Verificamos si el script ya existe para no cargarlo dos veces en la memoria
    const scriptExistente = document.getElementById('google-maps-script');
    
    if (!scriptExistente) {
      const script = document.createElement('script');
      script.id = 'google-maps-script';
      
      // OJO AQUÍ: Asegúrate de cambiar 'apiKey' por el nombre exacto 
      // de la variable que pusiste dentro de tu environment.ts
      script.src = `https://maps.googleapis.com/maps/api/js?key=${environment.apis.mapsApiKey}`;
      
      // Agregamos las propiedades para carga asíncrona (esto quita el warning amarillo)
      script.async = true;
      script.defer = true;
      
      // Finalmente, metemos el script en el <head> de la página
      document.head.appendChild(script);
    }
  }
}