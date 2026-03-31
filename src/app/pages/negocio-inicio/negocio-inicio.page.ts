import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  IonicModule, NavController, ToastController, AlertController 
} from '@ionic/angular';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addIcons } from 'ionicons';
import { 
  personCircleOutline, imageOutline, pencilOutline, trashOutline, 
  add, storefrontOutline, barChartOutline, starOutline, logOutOutline
} from 'ionicons/icons';

// Servicios
import { NegocioService } from '../../core/services/negocio.service';
import { AuthService } from '../../core/services/auth.service';
import { DatosNegocio } from '../../shared/interfaces/datos-negocio';
import { DatosUsuario } from '../../shared/interfaces/datos-usuario';

@Component({
  selector: 'app-negocio-inicio',
  templateUrl: './negocio-inicio.page.html',
  styleUrls: ['./negocio-inicio.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, TranslateModule] 
})
export class NegocioInicioPage implements OnInit {

  misNegocios: DatosNegocio[] = [];
  usuario: DatosUsuario | null = null;
  cargando = true;

  private navCtrl = inject(NavController);
  private toastCtrl = inject(ToastController);
  private alertCtrl = inject(AlertController);
  private negocioService = inject(NegocioService);
  private authService = inject(AuthService);
  private translate = inject(TranslateService);

  constructor() {
    addIcons({ 
      personCircleOutline, imageOutline, pencilOutline, trashOutline, 
      add, storefrontOutline, barChartOutline, starOutline, logOutOutline
    });
  }

  ngOnInit() {
    const usuarioStr = localStorage.getItem('user');
    if (usuarioStr) {
      this.usuario = JSON.parse(usuarioStr) as DatosUsuario;
      this.translate.use(this.usuario.idIdioma === 2 ? 'en' : 'es');
    }
  }

  ionViewWillEnter() {
    this.cargarMisNegocios();
  }

  cargarMisNegocios() {
    this.cargando = true;
    this.negocioService.obtenerTodos().subscribe({
      next: (data) => {
        this.misNegocios = data; 
        this.cargando = false;
      },
      error: (err) => {
        this.presentToast('Error al cargar tus negocios', 'danger');
        this.cargando = false;
      }
    });
  }

  irACrearNegocio() {
    this.navCtrl.navigateForward('/negocio-presentacion');
  }

  editarNegocio(negocio: DatosNegocio) {
    this.navCtrl.navigateForward('/negocio-presentacion', { state: { negocioEditable: negocio } });
  }

  irAPerfil() {
    this.navCtrl.navigateForward('/perfil');
  }

  logout() {
    this.authService.logout();
  }

  async borrarNegocio(negocio: DatosNegocio) {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar negocio?',
      message: `¿Estás seguro de borrar definitivamente "${negocio.nombre}"? Esta acción no se puede deshacer.`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.negocioService.eliminarNegocio(negocio.idNegocio).subscribe({
              next: () => {
                this.cargarMisNegocios();
                this.presentToast('Negocio eliminado correctamente', 'success');
              },
              error: () => this.presentToast('Error al eliminar. Verifica que no tenga reservas.', 'danger')
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(msg: string, color: string) {
    const toast = await this.toastCtrl.create({ message: msg, duration: 2500, color: color, position: 'top' });
    toast.present();
  }
}