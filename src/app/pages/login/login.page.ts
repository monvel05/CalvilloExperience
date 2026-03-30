import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth';
import { CommonModule } from '@angular/common'; 
import { addIcons } from 'ionicons';
import { 
  mailOutline, 
  lockClosedOutline, 
  alertCircleOutline,
  globeOutline // <-- Ícono para el chip de idioma agregado
} from 'ionicons/icons';
import { 
  IonHeader, IonLabel, IonItem, IonInput, IonContent, 
  IonToolbar, IonTitle, IonButton, IonIcon, IonText, 
  IonChip // <-- Componente Chip agregado
} from "@ionic/angular/standalone";
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';

// IMPORTAMOS LOS MÓDULOS DE TRADUCCIÓN
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonIcon, IonHeader, IonLabel, IonItem, IonInput, IonContent, IonToolbar, IonTitle, IonButton, IonText, 
    IonChip, // <-- Componente Chip agregado a los imports
    ReactiveFormsModule,
    RouterLink,
    CommonModule,
    TranslateModule // <-- Agregado para usar el pipe en el HTML
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  currentLang: string = 'es'; // <-- Variable para controlar el idioma actual del chip

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService // <-- Inyectado para traducir las alertas
  ) {
    // Añadimos globeOutline
    addIcons({mailOutline, alertCircleOutline, lockClosedOutline, globeOutline});

    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]], 
      contraseña: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    // Tomar el idioma actual al cargar la pantalla
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'es';
  }

  // Función para cambiar el idioma global de la app al hacer clic
  toggleLanguage() {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(this.currentLang);
  }

  iniciarSesion() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { correo, contraseña } = this.loginForm.value;

    this.authService.login(correo, contraseña).subscribe({
      next: (res: any) => {
        // Guardamos TODA la info del usuario en localStorage
        localStorage.setItem('user', JSON.stringify(res.user));
        localStorage.setItem('token', res.token);
        
        // Redirección
        switch (res.user.idTipoUsuario) {
          case 1:
            this.router.navigate(['administrador-inicio'], {replaceUrl: true});
            break;
          case 2:
            this.router.navigate(['turista-inicio'], {replaceUrl: true});
            break;
          case 3:
            this.router.navigate(['negocio-presentacion'], {replaceUrl: true});
            break;
          default:
            this.router.navigate(['home'], {replaceUrl: true});
            break;
        }
      },
      error: (err: any) => {
        // Traducimos el mensaje de error o usamos el que manda el backend
        const mensajeTraducido = this.translate.instant('LOGIN_PAGE.ERROR_CREDENTIALS');
        const mensaje = err.status === 400 ? err.error.message : mensajeTraducido;
        alert(mensaje);
      }
    });
  }
}