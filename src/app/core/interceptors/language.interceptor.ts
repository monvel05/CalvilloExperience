import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export const languageInterceptor: HttpInterceptorFn = (req, next) => {
  const translate = inject(TranslateService);
  
  // Obtenemos el idioma actual, si no hay uno, usamos español por defecto
  const currentLang = translate.currentLang || 'es';
  
  // Clonamos la petición para inyectar el header 'Accept-Language'
  const modifiedReq = req.clone({
    setHeaders: {
      'Accept-Language': currentLang
    }
  });

  // Continuamos con la petición modificada hacia Express
  return next(modifiedReq);
};