import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { 
  IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, 
  IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCard, IonCardHeader, 
  IonCardSubtitle, IonCardContent, IonLabel, IonInput, IonTextarea, 
  IonSelect, IonSelectOption, IonDatetime, IonText, IonToggle, IonFooter 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  imageOutline, storefrontOutline, timeOutline, callOutline,
  pricetagOutline, calendarOutline, locationOutline, saveOutline, calendarClearOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-negocio-presentacion',
  templateUrl: './negocio-presentacion.page.html',
  styleUrls: ['./negocio-presentacion.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, TranslateModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonContent, 
    IonGrid, IonRow, IonCol, IonButton, IonIcon, IonCard, IonCardHeader, 
    IonCardSubtitle, IonCardContent, IonLabel, IonInput, IonTextarea, 
    IonSelect, IonSelectOption, IonDatetime, IonText, IonToggle, IonFooter
  ]
})
export class NegocioPresentacionPage implements OnInit {

  negocioForm: FormGroup;
  categorias: string[] = ['Atractivos', 'Gastronomía', 'Hospedaje', 'Artesanías', 'Transporte'];
  modoEdicion: boolean = false;

  private fb = inject(FormBuilder);
  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);
  private translate = inject(TranslateService);
  private router = inject(Router);

  constructor() {
    addIcons({ imageOutline, storefrontOutline, timeOutline, callOutline, pricetagOutline, calendarOutline, locationOutline, saveOutline, calendarClearOutline });

    this.negocioForm = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      categoria: ['', Validators.required],
      diasTrabajo: [[]],
      diasDescanso: [[]],
      horaInicio: [''],
      horaFin: [''],
      telefono: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      permitirReservas: [false],
      imagen: [''],
      ubicacion: ['', Validators.required]
    });

    // Leemos los datos si venimos de editar desde el Dashboard
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state && navigation.extras.state['negocioData']) {
      const datos = navigation.extras.state['negocioData'];
      this.modoEdicion = true;
      this.negocioForm.patchValue(datos);
    }
  }

  ngOnInit() { }

  async guardarCambios() {
    if (this.negocioForm.invalid) {
      this.negocioForm.markAllAsTouched();
      this.presentToast('Por favor completa los campos obligatorios.', 'warning');
      return;
    }
    
    console.log('Guardando en BD:', this.negocioForm.value);
    
    await this.presentToast('¡Negocio guardado con éxito!', 'success');
    // Al terminar, regresamos al Dashboard
    this.navCtrl.navigateBack('/negocio-inicio');
  }

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

  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2000, color: color, position: 'top' });
    toast.present();
  }
}