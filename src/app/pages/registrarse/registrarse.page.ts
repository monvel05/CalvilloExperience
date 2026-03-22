import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth';
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
  alertCircleOutline 
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
  IonBackButton
} from "@ionic/angular/standalone";
import { CommonModule } from '@angular/common';

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
    RouterLink
  ]
})
export class RegistrarsePage {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    // Registro de iconos para que se visualicen en la interfaz
    addIcons({ 
      personOutline, 
      calendarOutline, 
      mailOutline, 
      lockClosedOutline,
      peopleOutline,
      maleFemaleOutline,
      languageOutline,
      alertCircleOutline 
    });

    // Inicialización del formulario con validaciones robustas
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      fechaNacimiento: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]],
      confirmarContraseña: ['', Validators.required],
      idTipoUsuario: ['2', Validators.required], // 2 = Turista por defecto según tu script SQL
      idGenero: ['', Validators.required],
      idIdioma: ['1', Validators.required]      // 1 = Español por defecto según tu script SQL
    }, { 
      // Aplicamos el validador de coincidencia de contraseñas a nivel de grupo
      validators: this.passwordMatchValidator 
    });
  }

  /**
   * Validador personalizado para asegurar que ambas contraseñas coincidan
   */
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('contraseña')?.value;
    const confirmPassword = control.get('confirmarContraseña')?.value;
    
    if (password !== confirmPassword) {
      // Marcamos el error específicamente en el campo de confirmar
      control.get('confirmarContraseña')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Método principal de registro
   */
  registrar() {
    // Si el formulario no es válido, marcamos todo como tocado para mostrar errores en UI
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      
      const missingFields = [];
      if (this.registroForm.get('nombre')?.invalid) missingFields.push('Nombre');
      if (this.registroForm.get('fechaNacimiento')?.invalid) missingFields.push('Fecha de nacimiento');
      if (this.registroForm.get('correo')?.invalid) missingFields.push('Correo electrónico');
      if (this.registroForm.get('contraseña')?.invalid) missingFields.push('Contraseña (mín. 6 caracteres)');
      if (this.registroForm.get('idGenero')?.invalid) missingFields.push('Género');
      
      alert(`Por favor, revisa los siguientes campos: ${missingFields.join(', ')}`);
      return;
    }

    // --- PROCESAMIENTO DE DATOS ---

    // 1. Usamos desestructuración para extraer los valores y descartar confirmarContraseña
    const { confirmarContraseña, ...valoresRaw } = this.registroForm.value;
    
    // 2. Transformamos los datos para que coincidan exactamente con los tipos de tu DB (INT)
    const datosFinales = {
      ...valoresRaw,
      idTipoUsuario: Number(valoresRaw.idTipoUsuario),
      idGenero: Number(valoresRaw.idGenero),
      idIdioma: Number(valoresRaw.idIdioma)
    };
    
    console.log("Enviando datos limpios al servidor:", datosFinales);

    // 3. Llamada al servicio
    this.authService.registrarUsuario(datosFinales).subscribe({
      next: (res: any) => {
        console.log("Respuesta del servidor:", res);
        alert("¡Cuenta creada con éxito! Bienvenido a Calvillo Experience.");
        
        // Redirección lógica basada en el rol registrado
        if (datosFinales.idTipoUsuario === 1) {
          this.router.navigate(['/admin-dashboard']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (err) => {
        console.error('Error en el registro:', err);
        
        // Manejo amigable de errores del servidor (como el 400 por correo duplicado)
        const mensajeError = err.error?.message || "No se pudo completar el registro. Intenta más tarde.";
        alert(mensajeError);
      }
    });
  }
}