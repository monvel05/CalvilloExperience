import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common'; 
import { addIcons } from 'ionicons';
import { 
  mailOutline, lockClosedOutline, alertCircleOutline, globeOutline 
} from 'ionicons/icons';
import { 
  IonHeader, IonLabel, IonItem, IonInput, IonContent, 
  IonToolbar, IonTitle, IonButton, IonIcon, IonText, 
  IonChip, ToastController
} from "@ionic/angular/standalone";

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonIcon, IonHeader, IonLabel, IonItem, IonInput, IonContent, IonToolbar, IonTitle, IonButton, IonText, 
    IonChip, ReactiveFormsModule, RouterLink, CommonModule, TranslateModule
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  currentLang: string = 'es'; 

  // Inyección moderna de dependencias
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  private toastCtrl = inject(ToastController);

  constructor() {
    addIcons({ mailOutline, alertCircleOutline, lockClosedOutline, globeOutline });

    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]], 
      contraseña: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'es';
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(this.currentLang);
  }

  async mostrarToast(mensaje: string, color: string = 'danger') {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

  iniciarSesion() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { correo, contraseña } = this.loginForm.value;

    this.authService.login(correo, contraseña).subscribe({
      next: (res: any) => {
        // Redirección inteligente basada en el rol del usuario (1, 2 o 3)
        switch (res.user.idTipoUsuario) {
          case 1:
            this.router.navigate(['administrador-inicio'], {replaceUrl: true});
            break;
          case 2:
            this.router.navigate(['turista-inicio'], {replaceUrl: true});
            break;
          case 3:
            this.router.navigate(['negocio-inicio'], {replaceUrl: true});
            break;
          default:
            this.router.navigate(['login'], {replaceUrl: true});
            break;
        }
      },
      error: (err: any) => {
        const mensajeTraducido = this.translate.instant('LOGIN_PAGE.ERROR_CREDENTIALS');
        const mensaje = err.status === 400 ? err.error.message : mensajeTraducido;
        this.mostrarToast(mensaje);
      }
    });
  }
}