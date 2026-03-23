import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';
import { importProvidersFrom } from '@angular/core';

import { AuthService } from './app/services/auth';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';
import { Observable } from 'rxjs';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { authInterceptor } from './app/auth-interceptor';
import { languageInterceptor } from './app/interceptor/language.interceptor';

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
    
    provideHttpClient(
      withInterceptors([authInterceptor, languageInterceptor])
    ),

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