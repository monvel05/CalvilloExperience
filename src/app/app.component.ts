import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  // Inyectamos el servicio de traducción
  private translate = inject(TranslateService);

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
  }
}
