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

  // Visibilidad de contraseñas
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;

  // Indicadores de fortaleza
  hasMinLength: boolean = false;
  hasUpperCase: boolean = false;
  hasSpecialChar: boolean = false;

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

  // 👁️ Toggle visibilidad de contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

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
    // Validar longitud mínima
    this.hasMinLength = this.contrasena.length >= 8;
    
    // Validar mayúscula
    this.hasUpperCase = /[A-Z]/.test(this.contrasena);
    
    // Validar carácter especial
    this.hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.contrasena);

    // Mensaje de error
    if (!this.hasMinLength) {
      this.contrasenaError = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!this.hasUpperCase) {
      this.contrasenaError = 'Debe incluir al menos una letra mayúscula';
    } else if (!this.hasSpecialChar) {
      this.contrasenaError = 'Debe incluir al menos un carácter especial';
    } else {
      this.contrasenaError = '';
    }

    this.validateConfirmar(); // validar también coincidencia
  }

  validateConfirmar() {
    this.confirmarError =
      this.contrasena && this.confirmarContrasena && this.contrasena !== this.confirmarContrasena
        ? 'Las contraseñas no coinciden'
        : '';
  }

  // ✅ Verificar si la contraseña es válida
  isPasswordValid(): boolean {
    return this.hasMinLength && this.hasUpperCase && this.hasSpecialChar;
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
      this.confirmarError ||
      !this.isPasswordValid()
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
          console.log('Registro exitoso:', response);
          this.isLoading = false;
          localStorage.setItem('pendingEmail', this.correoElectronico);
          this.router.navigate(['/auth/verify-email']);
        },
        error: (error) => {
          console.error('Error en registro:', error);
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