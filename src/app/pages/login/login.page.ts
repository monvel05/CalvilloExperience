import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Añadimos ReactiveFormsModule aquí
import { Router } from '@angular/router';
import { IonHeader, IonLabel, IonItem, IonInput, IonContent, IonToolbar, IonTitle, IonButton } from "@ionic/angular/standalone";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true, // Asegúrate de que esta propiedad esté presente
  imports: [
    IonHeader, IonLabel, IonItem, IonInput, IonContent, IonToolbar, IonTitle, IonButton,
    ReactiveFormsModule // También debemos importar el módulo de formularios aquí
  ]
})
export class LoginPage implements OnInit {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      usuario: ['', [Validators.required, Validators.email]],
      contraseña: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit() {}

  iniciarSesion() {
    if (this.loginForm.valid) {
      console.log("Datos del formulario:", this.loginForm.value);
      alert("¡Intentando iniciar sesión!");
    } else {
      // Marcamos los campos como tocados para mostrar errores visuales si los tuvieras
      this.loginForm.markAllAsTouched();
      alert("Por favor, revisa que los datos sean correctos.");
    }
  }
}