import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./forgot-password.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ForgotPasswordComponent {
  correoElectronico: string = '';
  
  // Estados
  isLoading: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Validaciones
  correoError: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  validateCorreo() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.correoError = !emailRegex.test(this.correoElectronico)
      ? 'Correo electrónico inválido'
      : '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.validateCorreo();

    if (this.correoError) {
      this.errorMessage = 'Por favor corrige los errores antes de continuar.';
      return;
    }

    this.isLoading = true;

    this.authService.forgotPassword(this.correoElectronico).subscribe({
      next: (response) => {
        console.log('✅ Código enviado:', response);
        this.isLoading = false;
        this.successMessage = response.message;
        
        // Redirigir a verificar código después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/verify-recovery-code']);
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
          this.errorMessage = 'Error al enviar el código. Intenta nuevamente.';
        }
        this.cdr.detectChanges();
      },
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}