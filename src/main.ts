import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { importProvidersFrom } from '@angular/core';
import { authInterceptor } from './app/core/interceptors/auth-interceptor';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

// 👇 ICONOS (AGREGADO)
import { addIcons } from 'ionicons';
import { 
  locationOutline, 
  calendarOutline, 
  timeOutline,
  chevronDownOutline,
  chevronBackOutline,
  chevronForwardOutline,
  cardOutline,
  callOutline,
  mailOutline
} from 'ionicons/icons';

// Importaciones de servicios, rutas y componentes
import { AuthService } from './app/core/services/auth';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { Observable } from 'rxjs';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { languageInterceptor } from './app/core/interceptors/language.interceptor';

// 👇 REGISTRO DE ICONOS (AGREGADO)
addIcons({
  'location-outline': locationOutline,
  'calendar-outline': calendarOutline,
  'time-outline': timeOutline,
  'chevron-down-outline': chevronDownOutline,
  'chevron-back-outline': chevronBackOutline,
  'chevron-forward-outline': chevronForwardOutline,
  'card-outline': cardOutline,
  'call-outline': callOutline,
  'mail-outline': mailOutline
});

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

export function HttpLoaderFactory(http: HttpClient) {
  return new CustomTranslateLoader(http);
}

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    // 👇 UNIFICADO (ANTES estaba duplicado)
    provideHttpClient(
      withInterceptors([authInterceptor, languageInterceptor])
    ),

    provideCharts(withDefaultRegisterables()),
    AuthService,

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