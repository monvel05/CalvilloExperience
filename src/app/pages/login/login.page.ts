import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth';
import { CommonModule } from '@angular/common'; 
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, alertCircleOutline } from 'ionicons/icons';
import { IonHeader, IonLabel, IonItem, IonInput, IonContent, IonToolbar, IonTitle, IonButton, IonIcon, IonText } from "@ionic/angular/standalone";
import { DatosUsuario } from 'src/app/shared/interfaces/datos-usuario';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonIcon, IonHeader, IonLabel, IonItem, IonInput, IonContent, IonToolbar, IonTitle, IonButton, IonText,
    ReactiveFormsModule,
    RouterLink,
    CommonModule
  ]
  // ELIMINADO: providers: [AuthService] 
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;
  usuario: DatosUsuario | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    addIcons({mailOutline, alertCircleOutline, lockClosedOutline});

    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]], 
      contraseña: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  iniciarSesion() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { correo, contraseña } = this.loginForm.value;

    this.authService.login(correo, contraseña).subscribe({
      next: (res: any) => {
        console.log("Login exitoso, rol recibido:", res.user.idTipoUsuario);
        
        // 1. Guardamos los datos directamente en la interfaz del componente
        this.usuario = res.user as DatosUsuario;
        
        // 2. Guardamos la sesión en el almacenamiento local
        // (Nota: Si tu AuthService ya hace esto en el pipe(tap(...)), puedes borrar estas dos líneas)
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        
        // 3. Redirección basada en el rol del usuario
        switch (res.user.idTipoUsuario) {
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
            this.router.navigate(['home'], {replaceUrl: true});
            break;
        }
      },
      error: (err: any) => {
        console.error("Error detectado en servidor:", err);
        const mensaje = err.status === 400 ? err.error.message : "Correo o contraseña incorrectos.";
        alert(mensaje);
      }
    });
  }
}