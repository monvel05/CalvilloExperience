import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, NavController, ToastController, LoadingController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  imageOutline, storefrontOutline, timeOutline, callOutline,
  pricetagOutline, calendarClearOutline, locationOutline, saveOutline, calendarOutline
} from 'ionicons/icons';

// Servicios
import { CloudinaryService } from '../../core/services/cloudinary.service';
import { NegocioService } from '../../core/services/negocio.service';
import { DatosNegocio } from '../../shared/interfaces/datos-negocio';

@Component({
  selector: 'app-negocio-presentacion',
  templateUrl: './negocio-presentacion.page.html',
  styleUrls: ['./negocio-presentacion.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule]
})
export class NegocioPresentacionPage implements OnInit {

  negocioForm: FormGroup;
  categorias: string[] = ['Atractivo Turístico', 'Restaurante', 'Cafetería', 'Artesanías', 'Hospedaje'];
  archivoImagen: File | null = null;
  negocioAEditar: DatosNegocio | null = null;
  esEdicion = false;

  private fb = inject(FormBuilder);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);
  private loadingCtrl = inject(LoadingController);
  private cloudinary = inject(CloudinaryService);
  private negocioService = inject(NegocioService);
  private translate = inject(TranslateService);

  constructor() {
    addIcons({ imageOutline, storefrontOutline, timeOutline, callOutline, pricetagOutline, calendarClearOutline, locationOutline, saveOutline, calendarOutline });

    this.negocioForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      diasTrabajo: [[]],
      diasDescanso: [[]],
      horaInicio: [''],
      horaFin: [''],
      horario: [''], 
      telefono: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      permitirReservas: [false],
      imagen: [''], 
      ubicacion: ['', Validators.required]
    });
  }

  ngOnInit() {
    const state = history.state;
    if (state && state.negocioEditable) {
      this.esEdicion = true;
      this.negocioAEditar = state.negocioEditable;
      
      this.negocioForm.patchValue({
        nombre: this.negocioAEditar?.nombre,
        descripcion: this.negocioAEditar?.descripcion,
        categoria: this.negocioAEditar?.categoria, 
        telefono: this.negocioAEditar?.telefono,
        horario: this.negocioAEditar?.horario,
        permitirReservas: this.negocioAEditar?.permitirReservas,
        imagen: this.negocioAEditar?.imagen?.[0] || '',
        ubicacion: this.negocioAEditar?.ubicacion?.direccionCompleta
      });
    }
  }

  volver() {
    // AHORA DIRIGE AL DASHBOARD
    this.navCtrl.navigateBack('/negocio-inicio');
  }

  abrirSelectorImagen(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]) {
      this.archivoImagen = input.files[0];
      
      const reader = new FileReader();
      reader.onload = () => {
        this.negocioForm.patchValue({ imagen: reader.result });
      };
      reader.readAsDataURL(this.archivoImagen);
    }
  }

  async guardarCambios() {
    if (this.negocioForm.invalid) {
      this.negocioForm.markAllAsTouched();
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando datos en el servidor...',
      spinner: 'crescent'
    });
    await loading.present();

    try {
      let urlImagen = this.negocioForm.get('imagen')?.value;

      if (this.archivoImagen) {
        const resCloudinary = await this.cloudinary.uploadImage(this.archivoImagen);
        urlImagen = resCloudinary.secure_url;
      }

      const formData = this.negocioForm.value;
      const datosFinales = {
        ...formData,
        horario: `${formData.horaInicio || ''} a ${formData.horaFin || ''}`, 
        imagen: [urlImagen] 
      };

      if (this.esEdicion && this.negocioAEditar) {
        await this.negocioService.actualizarNegocio(this.negocioAEditar.idNegocio, datosFinales).toPromise();
      } else {
        await this.negocioService.crearNegocio(datosFinales).toPromise();
      }

      await loading.dismiss();
      this.presentToast('Negocio guardado exitosamente', 'success');
      this.navCtrl.navigateBack('/negocio-inicio');

    } catch (error) {
      console.error(error);
      await loading.dismiss();
      this.presentToast('Hubo un error al guardar. Intenta nuevamente.', 'danger');
    }
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 3000, color: color, position: 'top' });
    toast.present();
  }
}