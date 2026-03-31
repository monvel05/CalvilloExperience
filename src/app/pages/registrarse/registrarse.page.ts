import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  personOutline, 
  calendarOutline, 
  mailOutline, 
  lockClosedOutline,
  peopleOutline,
  maleFemaleOutline,
  languageOutline,
  alertCircleOutline,
  globeOutline // <-- Ícono para el chip de idioma
} from 'ionicons/icons';
import { 
  IonHeader, 
  IonToolbar, 
  IonTitle, 
  IonContent, 
  IonItem, 
  IonLabel, 
  IonInput, 
  IonButton, 
  IonIcon, 
  IonSelect, 
  IonSelectOption,
  IonButtons,
  IonBackButton,
  IonChip // <-- Importar el componente Chip
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registrarse',
  templateUrl: './registrarse.page.html',
  styleUrls: ['./registrarse.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonItem, 
    IonLabel, 
    IonInput, 
    IonButton, 
    IonIcon, 
    IonSelect, 
    IonSelectOption,
    IonButtons,
    IonBackButton,
    IonChip, // <-- Añadido
    RouterLink,
    TranslateModule 
  ]
})
export class RegistrarsePage implements OnInit {
  registroForm: FormGroup;
  currentLang: string = 'es'; // Variable para controlar el chip

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService 
  ) {
    addIcons({ 
      personOutline, 
      calendarOutline, 
      mailOutline, 
      lockClosedOutline,
      peopleOutline,
      maleFemaleOutline,
      languageOutline,
      alertCircleOutline,
      globeOutline // <-- Añadido
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

    // UX: Si el usuario cambia el idioma manualmente en el select (1 o 2), actualizar la página y el chip
    this.registroForm.get('idIdioma')?.valueChanges.subscribe(valor => {
      if (valor) {
        this.currentLang = valor === '1' ? 'es' : 'en';
        this.translate.use(this.currentLang);
      }
    });
  }

  ngOnInit() {
    // Tomar el idioma actual del servicio al entrar a la página
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'es';
    // Sincronizar el select por defecto
    this.registroForm.get('idIdioma')?.setValue(this.currentLang === 'es' ? '1' : '2', { emitEvent: false });
  }

  // UX: Función para el chip. Si dan clic, cambiamos el idioma global y el del formulario
  toggleLanguage() {
    this.currentLang = this.currentLang === 'es' ? 'en' : 'es';
    this.translate.use(this.currentLang);
    // Sincronizamos con el select interno
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

  registrar() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      
      const missingFields = [];
      if (this.registroForm.get('nombre')?.invalid) missingFields.push(this.translate.instant('REGISTER_PAGE.FULL_NAME'));
      if (this.registroForm.get('fechaNacimiento')?.invalid) missingFields.push(this.translate.instant('REGISTER_PAGE.BIRTH_DATE'));
      if (this.registroForm.get('correo')?.invalid) missingFields.push(this.translate.instant('REGISTER_PAGE.EMAIL'));
      if (this.registroForm.get('contraseña')?.invalid) missingFields.push(this.translate.instant('REGISTER_PAGE.PASSWORD'));
      if (this.registroForm.get('idGenero')?.invalid) missingFields.push(this.translate.instant('REGISTER_PAGE.GENDER'));
      
      const msgErrorBase = this.translate.instant('REGISTER_PAGE.ERROR_MISSING_FIELDS');
      alert(`${msgErrorBase} ${missingFields.join(', ')}`);
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
      next: (res: any) => {
        alert(this.translate.instant('REGISTER_PAGE.SUCCESS_MSG'));
        
        if (datosFinales.idTipoUsuario === 1) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        const fallbackMsg = this.translate.instant('REGISTER_PAGE.ERROR_DEFAULT');
        const mensajeError = err.error?.message || fallbackMsg;
        alert(mensajeError);
      }
    });
  }
}