import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { addIcons } from 'ionicons';
import { 
  personOutline, calendarOutline, mailOutline, lockClosedOutline,
  peopleOutline, maleFemaleOutline, languageOutline, alertCircleOutline, globeOutline 
} from 'ionicons/icons';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, 
  IonInput, IonButton, IonIcon, IonSelect, IonSelectOption,
  IonButtons, IonBackButton, IonChip, ToastController 
} from "@ionic/angular/standalone";

import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, IonTitle, 
    IonContent, IonItem, IonLabel, IonInput, IonButton, IonIcon, 
    IonSelect, IonSelectOption, IonButtons, IonBackButton, IonChip, 
    RouterLink, TranslateModule 
  ]
})
export class RegistrarsePage implements OnInit {
  registroForm: FormGroup;
  currentLang: string = 'es'; 

  // Inyección moderna de dependencias
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService);
  private toastCtrl = inject(ToastController);

  constructor() {
    addIcons({ 
      personOutline, calendarOutline, mailOutline, lockClosedOutline,
      peopleOutline, maleFemaleOutline, languageOutline, alertCircleOutline, globeOutline 
    });

    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fechaNacimiento: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContraseña: ['', Validators.required],
      idTipoUsuario: ['2', Validators.required], 
      idGenero: ['', Validators.required],
      idIdioma: ['1', Validators.required] 
    }, { 
      validators: this.passwordMatchValidator 
    });

    this.registroForm.get('idIdioma')?.valueChanges.subscribe(valor => {
      if (valor) {
        this.currentLang = valor === '1' ? 'es' : 'en';
        this.translate.use(this.currentLang);
      }
    });
  }

  ngOnInit() {
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'es';
    this.registroForm.get('idIdioma')?.setValue(this.currentLang === 'es' ? '1' : '2', { emitEvent: false });
  }

  toggleLanguage() {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(this.currentLang);
    this.registroForm.get('idIdioma')?.setValue(this.currentLang === 'es' ? '1' : '2', { emitEvent: false });
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('contraseña')?.value;
    const confirmPassword = control.get('confirmarContraseña')?.value;
    
    if (password !== confirmPassword) {
      control.get('confirmarContraseña')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
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

  registrar() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      this.mostrarToast(this.translate.instant('REGISTER_PAGE.ERROR_MISSING_FIELDS'));
      return;
    }

    const { confirmarContraseña, ...valoresRaw } = this.registroForm.value;
    
    const datosFinales = {
      ...valoresRaw,
      idTipoUsuario: Number(valoresRaw.idTipoUsuario),
      idGenero: Number(valoresRaw.idGenero),
      idIdioma: Number(valoresRaw.idIdioma)
    };
    
    this.authService.registrarUsuario(datosFinales).subscribe({
      next: () => {
        this.mostrarToast(this.translate.instant('REGISTER_PAGE.SUCCESS_MSG'), 'success');
        // Tras registrarse, se envía al login para que ingrese sus credenciales
        setTimeout(() => this.router.navigate(['/login']), 1500);
      },
      error: (err) => {
        const fallbackMsg = this.translate.instant('REGISTER_PAGE.ERROR_DEFAULT');
        const mensajeError = err.error?.message || fallbackMsg;
        this.mostrarToast(mensajeError);
      }
    });
  }
}