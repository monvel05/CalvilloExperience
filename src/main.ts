import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
// ESTA ES LA IMPORTACIÓN QUE DEBES AGREGAR:
import { AuthService } from './app/services/auth';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { Observable } from 'rxjs';

//Imports de lenguajes y su interceptor
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { languageInterceptor } from './app/interceptor/language.interceptor';



// 1. Creamos nuestra propia clase Loader (hace exactamente lo mismo que TranslateHttpLoader 
// pero con la posibilidad de configurar el path y el formato)
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
    provideHttpClient(), // <-- Ahora esto ya no marcará error
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    AuthService,
    provideHttpClient(withInterceptors([languageInterceptor])),
  ],
});