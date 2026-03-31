import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, 
  IonLabel, IonInput, IonButton, IonIcon, IonSelect, 
  IonSelectOption, IonButtons, IonBackButton, IonSpinner, ToastController
} from "@ionic/angular/standalone";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { 
  personOutline, mailOutline, calendarOutline, 
  maleFemaleOutline, languageOutline, saveOutline, arrowBackOutline 
} from 'ionicons/icons';

// Servicios Core
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, 
    IonTitle, IonContent, IonItem, IonLabel, IonInput, 
    IonButton, IonIcon, IonSelect, IonSelectOption, 
    IonButtons, IonBackButton, IonSpinner, TranslateModule 
  ]
})
export class PerfilPage {
  
  // Inyección moderna
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService); 
  private toastCtrl = inject(ToastController);

  perfilForm: FormGroup;
  idUsuarioActual: number = 0;
  guardando: boolean = false;

  constructor() {
    addIcons({ 
      personOutline, mailOutline, calendarOutline, 
      maleFemaleOutline, languageOutline, saveOutline, arrowBackOutline 
    });
    
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', Validators.required],
      idGenero: ['', Validators.required],
      idIdioma: ['', Validators.required]
    });

    this.perfilForm.get('idIdioma')?.valueChanges.subscribe(valor => {
      if (valor) {
        const idioma = valor === '2' ? 'en' : 'es';
        this.translate.use(idioma);
      }
    });
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    const usuarioLogueadoStr = localStorage.getItem('user');
    
    if (!usuarioLogueadoStr) {
      this.mostrarToast(this.translate.instant('PROFILE.MSG_NO_SESSION'), 'warning');
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    const usuarioLogueado: DatosUsuario = JSON.parse(usuarioLogueadoStr);
    this.idUsuarioActual = usuarioLogueado.idUsuario;

    const idiomaActual = usuarioLogueado.idIdioma === 2 ? 'en' : 'es';
    this.translate.use(idiomaActual);

    this.llenarFormulario(usuarioLogueado);

    // Refrescamos con datos de Express por si hubo cambios en otro dispositivo
    this.usuarioService.obtenerUsuario(this.idUsuarioActual).subscribe({
      next: (datosFrescos) => {
        this.llenarFormulario(datosFrescos);
        
        if (datosFrescos.idIdioma) {
           const idiomaFresco = datosFrescos.idIdioma === 2 ? 'en' : 'es';
           this.translate.use(idiomaFresco);
        }

        const usuarioSincronizado = { ...usuarioLogueado, ...datosFrescos };
        localStorage.setItem('user', JSON.stringify(usuarioSincronizado));
      },
      error: (err) => console.warn('Usando datos locales por error de red', err)
    });
  }

  private llenarFormulario(datos: Partial<DatosUsuario>) {
    let fechaFormateada = '';
    if (datos.fechaNacimiento) {
      try {
        fechaFormateada = new Date(datos.fechaNacimiento).toISOString().split('T')[0];
      } catch (e) {
        fechaFormateada = '';
      }
    }

    this.perfilForm.patchValue({
      nombre: datos.nombre,
      correo: datos.correo,
      fechaNacimiento: fechaFormateada,
      idGenero: datos.idGenero?.toString(),
      idIdioma: datos.idIdioma?.toString()
    }, { emitEvent: false }); 
  }

  guardarCambios() {
    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    this.guardando = true;
    
    const datosForm = this.perfilForm.value;
    const datosActualizados = {
      ...datosForm,
      idGenero: Number(datosForm.idGenero),
      idIdioma: Number(datosForm.idIdioma)
    };

    this.usuarioService.actualizarPerfil(this.idUsuarioActual, datosActualizados).subscribe({
      next: (res) => {
        this.mostrarToast(this.translate.instant('PROFILE.MSG_SUCCESS'), 'success');
        
        const usuarioActualStr = localStorage.getItem('user');
        if (usuarioActualStr) {
          const usuarioActual = JSON.parse(usuarioActualStr);
          const usuarioNuevo = { ...usuarioActual, ...datosActualizados };
          localStorage.setItem('user', JSON.stringify(usuarioNuevo));
        }
        
        this.guardando = false;
      },
      error: (err) => {
        this.mostrarToast(this.translate.instant('PROFILE.MSG_ERROR'), 'danger');
        this.guardando = false;
      }
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color: color,
      position: 'top'
    });
    toast.present();
  }

  volver() {
    const usuarioLogueadoStr = localStorage.getItem('user');
    
    if (!usuarioLogueadoStr) {
      this.router.navigate(['login'], {replaceUrl: true});
      return;
    }

    const usuarioActual: DatosUsuario = JSON.parse(usuarioLogueadoStr);

    switch (usuarioActual.idTipoUsuario) {
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
  }
}