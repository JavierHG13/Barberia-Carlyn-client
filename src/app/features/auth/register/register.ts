import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./register.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Register {
  nombreCompleto: string = '';
  correoElectronico: string = '';
  telefono: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';

  // Estados
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';

  // Mensajes individuales
  nombreError = '';
  correoError = '';
  telefonoError = '';
  contrasenaError = '';
  confirmarError = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  // 🧠 Validaciones en tiempo real
  validateNombre() {
    this.nombreError = this.nombreCompleto.trim().length < 3 ? 'El nombre es muy corto' : '';
  }

  validateCorreo() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.correoError = !emailRegex.test(this.correoElectronico)
      ? 'Correo electrónico inválido'
      : '';
  }

  validateTelefono() {
    const phoneRegex = /^\d{10,}$/;
    this.telefonoError = !phoneRegex.test(this.telefono)
      ? 'Debe tener al menos 10 dígitos numéricos'
      : '';
  }

  validateContrasena() {
    this.contrasenaError =
      this.contrasena.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : '';
    this.validateConfirmar(); // validar también coincidencia
  }

  validateConfirmar() {
    this.confirmarError =
      this.contrasena && this.confirmarContrasena && this.contrasena !== this.confirmarContrasena
        ? 'Las contraseñas no coinciden'
        : '';
  }

  // 🔹 Registro final
  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    // Validar antes de enviar
    this.validateNombre();
    this.validateCorreo();
    this.validateTelefono();
    this.validateContrasena();
    this.validateConfirmar();

    if (
      this.nombreError ||
      this.correoError ||
      this.telefonoError ||
      this.contrasenaError ||
      this.confirmarError
    ) {
      this.errorMessage = 'Por favor corrige los errores antes de continuar.';
      return;
    }

    this.isLoading = true;

    this.authService
      .register({
        nombreCompleto: this.nombreCompleto,
        correoElectronico: this.correoElectronico,
        telefono: this.telefono,
        contrasena: this.contrasena,
      })
      .subscribe({
        next: (response) => {
          console.log('✅ Registro exitoso:', response);
          this.isLoading = false;
          localStorage.setItem('pendingEmail', this.correoElectronico);
          this.router.navigate(['/auth/verify-email']);
        },
        error: (error) => {
          console.error('❌ Error en registro:', error);
          this.isLoading = false;

          if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else if (error.status === 0) {
            this.errorMessage = 'No se pudo conectar con el servidor';
          } else {
            this.errorMessage = 'Error al registrar. Intenta nuevamente.';
          }
          this.cdr.detectChanges();
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
