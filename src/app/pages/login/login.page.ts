import { Component, OnInit, inject } from '@angular/core'; // Usamos inject
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service'; // Ruta corregida a .service
import { CommonModule } from '@angular/common'; 
import { addIcons } from 'ionicons';
import { 
  mailOutline, lockClosedOutline, alertCircleOutline, globeOutline 
} from 'ionicons/icons';
import { 
  IonLabel, IonItem, IonInput, IonContent, 
  IonButton, IonIcon, IonChip, NavController, ToastController // Agregamos NavController y Toast
} from "@ionic/angular/standalone";

import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonIcon, IonLabel, IonItem, IonInput, IonContent, IonButton, 
    IonChip, ReactiveFormsModule, RouterLink, CommonModule, TranslateModule
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  currentLang: string = 'es';

  // Inyección moderna de dependencias (Angular 20 style)
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private translate = inject(TranslateService);
  private navCtrl = inject(NavController); // Para navegación fluida en Ionic
  private toastCtrl = inject(ToastController); // Reemplazamos el alert() por algo más profesional

  constructor() {
    addIcons({ mailOutline, alertCircleOutline, lockClosedOutline, globeOutline });

    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]], 
      // Mantenemos minLength(6) para que coincida con tu validación de registro
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

  async mostrarToast(mensaje: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 3000,
      position: 'top',
      color: 'danger'
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
        // Redirección usando navigateRoot para limpiar el historial y evitar bloqueos
        const rol = Number(res.user.idTipoUsuario);
        
        switch (rol) {
          case 1:
            this.navCtrl.navigateRoot('/administrador-inicio');
            break;
          case 2:
            this.navCtrl.navigateRoot('/turista-inicio');
            break;
          case 3:
            this.navCtrl.navigateRoot('/negocio-presentacion');
            break;
          default:
            this.navCtrl.navigateRoot('/home');
            break;
        }
      },
      error: (err: any) => {
        const mensajeTraducido = this.translate.instant('LOGIN_PAGE.ERROR_CREDENTIALS');
        // Si el backend manda un mensaje específico lo usamos, si no, la traducción
        const mensaje = err.error?.message || mensajeTraducido;
        this.mostrarToast(mensaje);
      }
    });
  }
}