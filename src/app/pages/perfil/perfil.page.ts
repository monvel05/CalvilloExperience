import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, 
  IonLabel, IonInput, IonButton, IonIcon, IonSelect, 
  IonSelectOption, IonButtons, IonBackButton, IonSpinner, IonToast
} from "@ionic/angular/standalone";
import { addIcons } from 'ionicons';
import { 
  personOutline, mailOutline, calendarOutline, 
  maleFemaleOutline, languageOutline, saveOutline, arrowBackOutline 
} from 'ionicons/icons';

import { UsuarioService } from 'src/app/core/services/usuario.service';
import { AuthService } from 'src/app/core/services/auth';
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';
import { Router } from '@angular/router';

// IMPORTANTE: Importamos los módulos de traducción
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, IonHeader, IonToolbar, 
    IonTitle, IonContent, IonItem, IonLabel, IonInput, 
    IonButton, IonIcon, IonSelect, IonSelectOption, 
    IonButtons, IonBackButton, IonSpinner, IonToast,
    TranslateModule // <-- Agregamos TranslateModule para usar el pipe en el HTML
  ]
})
export class PerfilPage {
  private fb = inject(FormBuilder);
  private usuarioService = inject(UsuarioService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private translate = inject(TranslateService); // <-- Inyectamos el servicio de traducción

  perfilForm: FormGroup;
  idUsuarioActual: number = 0;
  guardando: boolean = false;
  
  mostrarToast: boolean = false;
  mensajeToast: string = '';

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

    // Cambiar el idioma en tiempo real cuando el usuario seleccione otra opción en el select
    this.perfilForm.get('idIdioma')?.valueChanges.subscribe(valor => {
      // 1 = Español, 2 = Inglés
      const idioma = valor === '2' ? 'en' : 'es';
      this.translate.use(idioma);
    });
  }

  ionViewWillEnter() {
    this.cargarDatos();
  }

  cargarDatos() {
    const usuarioLogueadoStr = localStorage.getItem('user');
    
    if (!usuarioLogueadoStr) {
      // Usamos translate.instant() para traducir textos en el código TypeScript
      this.mostrarMensaje(this.translate.instant('PROFILE.MSG_NO_SESSION'));
      this.router.navigate(['/login'], { replaceUrl: true });
      return;
    }

    const usuarioLogueado: DatosUsuario = JSON.parse(usuarioLogueadoStr);
    this.idUsuarioActual = usuarioLogueado.idUsuario;

    // Establecemos el idioma inicial según la base de datos
    const idiomaActual = usuarioLogueado.idIdioma === 2 ? 'en' : 'es';
    this.translate.use(idiomaActual);

    this.llenarFormulario(usuarioLogueado);

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
      error: (err) => console.warn('Usando datos locales', err)
    });
  }

  private llenarFormulario(datos: Partial<DatosUsuario>) {
    const fechaFormateada = datos.fechaNacimiento ? 
      new Date(datos.fechaNacimiento).toISOString().split('T')[0] : '';

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
        // Obtenemos el mensaje de éxito traducido
        this.mostrarMensaje(this.translate.instant('PROFILE.MSG_SUCCESS'));
        
        const usuarioActualStr = localStorage.getItem('user');
        if (usuarioActualStr) {
          const usuarioActual = JSON.parse(usuarioActualStr);
          const usuarioNuevo = { ...usuarioActual, ...datosActualizados };
          localStorage.setItem('user', JSON.stringify(usuarioNuevo));
        }
        
        this.guardando = false;
      },
      error: (err) => {
        // Obtenemos el mensaje de error traducido
        this.mostrarMensaje(this.translate.instant('PROFILE.MSG_ERROR'));
        this.guardando = false;
      }
    });
  }

  mostrarMensaje(mensaje: string) {
    this.mensajeToast = mensaje;
    this.mostrarToast = true;
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