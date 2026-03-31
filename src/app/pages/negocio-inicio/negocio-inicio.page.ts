// negocio-inicio.page.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicModule, NavController, ToastController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  imageOutline,
  storefrontOutline,
  timeOutline,
  callOutline,
  pricetagOutline,
  calendarClearOutline,
  locationOutline,
  saveOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-negocio-inicio',
  templateUrl: './negocio-inicio.page.html',
  styleUrls: ['./negocio-inicio.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ]
})
export class NegocioInicioPage implements OnInit {

  negocioForm: FormGroup;
  categorias: string[] = ['Atractivo Turístico', 'Restaurante', 'Cafetería', 'Artesanías'];

  constructor(
    private fb: FormBuilder,
    private navCtrl: NavController,
    private toastCtrl: ToastController,
    private translate: TranslateService
  ) {
    addIcons({
      personCircleOutline,
      imageOutline,
      storefrontOutline,
      timeOutline,
      callOutline,
      pricetagOutline,
      calendarClearOutline,
      locationOutline,
      saveOutline
    });

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

  ngOnInit() { }

  cambiarImagen() {
    this.presentToast('Simulando apertura de archivos...', 'primary');
    const imagenSimulada = 'assets/img-simulated.jpg';
    this.negocioForm.patchValue({ imagen: imagenSimulada });
  }

  async guardarCambios() {
    if (this.negocioForm.invalid) {
      this.negocioForm.markAllAsTouched();
      return;
    }
    const datosNegocio = this.negocioForm.value;
    console.log('Datos del negocio a guardar:', datosNegocio);
    const msgExito = this.translate.instant('NEGOCIO_INICIO.GUARDAR_EXITO');
    await this.presentToast(msgExito, 'success');
    this.navCtrl.navigateBack('/negocio-presentacion');
  }

  irAPerfil() {
    this.navCtrl.navigateForward('/perfil');
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2000,
      color: color,
      position: 'bottom'
    });
    toast.present();
  }

  // ✅ Métodos para manejar la portada
  abrirSelectorImagen(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.negocioForm.patchValue({ imagen: reader.result });
      };
      reader.readAsDataURL(file);
    }
  }
}
