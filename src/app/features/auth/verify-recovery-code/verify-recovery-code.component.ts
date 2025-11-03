import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-recovery-code',
  templateUrl: './verify-recovery-code.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./verify-recovery-code.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class VerifyRecoveryCodeComponent implements OnDestroy {
  code: string = '';
  
  // Estados
  isLoading: boolean = false;
  isResending: boolean = false;
  errorMessage: string = '';
  successMessage: string = '';
  
  // Validaciones
  codeError: string = '';
  
  // Countdown para reenviar
  countdown: number = 0;
  private countdownInterval: any;

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

  ngOnDestroy(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  validateCode() {
    const codeRegex = /^\d{6}$/;
    this.codeError = !codeRegex.test(this.code)
      ? 'El código debe tener 6 dígitos'
      : '';
  }

  onSubmit(): void {
    this.errorMessage = '';
    this.successMessage = '';

    this.validateCode();

    if (this.codeError) {
      this.errorMessage = 'Por favor corrige los errores antes de continuar.';
      return;
    }

    this.isLoading = true;

    this.authService.verifyRecoveryCode(this.code).subscribe({
      next: (response) => {
        console.log('✅ Código verificado:', response);
        this.isLoading = false;
        this.successMessage = response.message;
        
        // Redirigir a cambiar contraseña después de 1.5 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/reset-password']);
        }, 1500);
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.isLoading = false;

        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar con el servidor';
        } else {
          this.errorMessage = 'Código inválido. Intenta nuevamente.';
        }
        this.cdr.detectChanges();
      },
    });
  }

  resendCode(): void {
    if (this.countdown > 0) return;

    this.isResending = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.resendRecoveryCode().subscribe({
      next: (response) => {
        console.log('✅ Código reenviado:', response);
        this.isResending = false;
        this.successMessage = 'Código reenviado exitosamente';
        
        // Iniciar countdown de 60 segundos
        this.startCountdown(60);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('❌ Error:', error);
        this.isResending = false;

        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Error al reenviar el código';
        }
        this.cdr.detectChanges();
      },
    });
  }

  private startCountdown(seconds: number): void {
    this.countdown = seconds;
    
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        clearInterval(this.countdownInterval);
      }
      this.cdr.detectChanges();
    }, 1000);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}