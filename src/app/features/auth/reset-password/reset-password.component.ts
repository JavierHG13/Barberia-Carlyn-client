import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./reset-password.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ResetPasswordComponent {
  newPassword: string = '';
  confirmPassword: string = '';
  
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
  
  // Validaciones
  passwordError: string = '';
  confirmError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    // Verificar que haya un email de recuperación
    const recoveryEmail = localStorage.getItem('recoveryEmail');
    if (!recoveryEmail) {
      this.router.navigate(['/auth/forgot-password']);
    }
  }

  // 👁️ Toggle visibilidad de contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validatePassword() {
    // Validar longitud mínima
    this.hasMinLength = this.newPassword.length >= 8;
    
    // Validar mayúscula
    this.hasUpperCase = /[A-Z]/.test(this.newPassword);
    
    // Validar carácter especial
    this.hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.newPassword);

    // Mensaje de error
    if (!this.hasMinLength) {
      this.passwordError = 'La contraseña debe tener al menos 8 caracteres';
    } else if (!this.hasUpperCase) {
      this.passwordError = 'Debe incluir al menos una letra mayúscula';
    } else if (!this.hasSpecialChar) {
      this.passwordError = 'Debe incluir al menos un carácter especial';
    } else {
      this.passwordError = '';
    }

    this.validateConfirm();
  }

  validateConfirm() {
    this.confirmError =
      this.newPassword && this.confirmPassword && this.newPassword !== this.confirmPassword
        ? 'Las contraseñas no coinciden'
        : '';
  }

  // ✅ Verificar si la contraseña es válida
  isPasswordValid(): boolean {
    return this.hasMinLength && this.hasUpperCase && this.hasSpecialChar && !this.confirmError;
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.validatePassword();
    this.validateConfirm();

    if (this.passwordError || this.confirmError || !this.isPasswordValid()) {
      this.errorMessage = 'Por favor corrige los errores antes de continuar.';
      return;
    }

    this.isLoading = true;

    this.authService.resetPassword(this.newPassword).subscribe({
      next: (response) => {
        console.log('✅ Contraseña cambiada:', response);
        this.isLoading = false;
        this.successMessage = 'Contraseña cambiada exitosamente. Redirigiendo...';
        
        // Limpiar y redirigir al login después de 2 segundos
        setTimeout(() => {
          localStorage.removeItem('recoveryEmail');
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.isLoading = false;

        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor';
        } else {
          this.errorMessage = 'Error al cambiar la contraseña. Intenta nuevamente.';
        }
        this.cdr.detectChanges();
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}