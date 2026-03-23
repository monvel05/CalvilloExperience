import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth';

import { CommonModule } from '@angular/common'; // Importante para *ngIf
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, alertCircleOutline } from 'ionicons/icons';
import { IonHeader, IonLabel, IonItem, IonInput, IonContent, IonToolbar, IonTitle, IonButton, IonIcon, IonText } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    IonIcon, IonHeader, IonLabel, IonItem, IonInput, IonContent, IonToolbar, IonTitle, IonButton, IonText,
    ReactiveFormsModule,
    RouterLink,
    CommonModule // <--- Obligatorio para usar *ngIf en el HTML
  ],
  providers: [AuthService]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

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
        console.log("Login exitoso, rol recibido:", res.user.rol);
        
        // 1. Guardamos la sesión en el almacenamiento local
        localStorage.setItem('token', res.token);
        localStorage.setItem('user', JSON.stringify(res.user));
        
        // 2. Redirección basada en el rol del usuario
        switch (res.user.rol) {
          case 1:
            this.router.navigate(['/administrador-inicio']);
            break;
          case 2:
            this.router.navigate(['/turista-inicio']);
            break;
          case 3:
            this.router.navigate(['/negocio-inicio']);
            break;
          default:
            this.router.navigate(['/home']);
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