import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { importProvidersFrom } from '@angular/core'; // <-- AGREGADO: Necesario para cargar módulos clásicos
import { authInterceptor } from './app/auth-interceptor';

// Importaciones de servicios, rutas y componentes
import { AuthService } from './app/services/auth';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { Observable } from 'rxjs';

// Imports de lenguajes y su interceptor
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { languageInterceptor } from './app/interceptor/language.interceptor';

// 1. Creamos nuestra propia clase Loader
export class CustomTranslateLoader implements TranslateLoader {
  constructor(
    private http: HttpClient, 
    public prefix: string = './assets/i18n/', 
    public suffix: string = '.json'
  ) {}

  public getTranslation(lang: string): Observable<any> {
    return this.http.get(`${this.prefix}${lang}${this.suffix}`);
  }
}

// 2. Actualizamos el Factory para usar nuestra nueva clase
export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    
    // Tus servicios
    AuthService,
    
    // UNIFICADO: Solo llamamos a provideHttpClient una vez, pasándole tu interceptor
    provideHttpClient(withInterceptors([languageInterceptor])),

    // AGREGADO: La inyección global del módulo de traducciones
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
    )
  ],
}).catch(err => console.error(err));