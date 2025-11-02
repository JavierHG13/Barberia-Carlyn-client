import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
    imports:[CommonModule, FormsModule],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})

export class VerifyEmailComponent implements OnInit {
  verificationCode: string = '';
  email: string = '';
  errorMessage: string = '';
  successMessage: string = '';
  isVerifying: boolean = false;
  isResending: boolean = false;

  // Timer para reenviar código
  canResend: boolean = true;
  resendTimer: number = 0;
  private timerInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Obtener el email de localStorage o state
    this.email = localStorage.getItem('pendingEmail') || '';
    
    if (!this.email) {
      // Si no hay email pendiente, redirigir al registro
      this.router.navigate(['/registro']);
    }
  }

  ngOnDestroy(): void {
    // Limpiar el timer al destruir el componente
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  onVerifyEmail(): void {
    // Limpiar mensajes
    this.errorMessage = '';
    this.successMessage = '';

    // Validar código
    if (!this.verificationCode || this.verificationCode.length !== 6) {
      this.errorMessage = 'Por favor ingresa el código de 6 dígitos';
      return;
    }

    // Validar que sean solo números
    if (!/^\d{6}$/.test(this.verificationCode)) {
      this.errorMessage = 'El código debe contener solo números';
      return;
    }

    this.isVerifying = true;

    // Verificar código
    this.authService.verifyEmail(this.verificationCode).subscribe({
      next: (response) => {
        console.log('Verificación exitosa:', response);
        this.isVerifying = false;
        this.successMessage = response.message;
        
        // Limpiar email pendiente
        localStorage.removeItem('pendingEmail');
        
        // Redirigir al login después de 2 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 2000);
      },
      error: (error) => {
        console.error('Error en verificación:', error);
        this.isVerifying = false;
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Código incorrecto. Intenta nuevamente.';
        }
      }
    });
  }

  onResendCode(): void {
    if (!this.canResend) return;

    this.errorMessage = '';
    this.successMessage = '';
    this.isResending = true;

    this.authService.resendCode().subscribe({
      next: (response) => {
        console.log('Código reenviado:', response);
        this.isResending = false;
        this.successMessage = response.message;
        
        // Iniciar timer de 60 segundos
        this.startResendTimer();
      },
      error: (error) => {
        console.error('Error al reenviar código:', error);
        this.isResending = false;
        
        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Error al reenviar código. Intenta nuevamente.';
        }
      }
    });
  }

  startResendTimer(): void {
    this.canResend = false;
    this.resendTimer = 60;

    this.timerInterval = setInterval(() => {
      this.resendTimer--;
      
      if (this.resendTimer <= 0) {
        this.canResend = true;
        clearInterval(this.timerInterval);
      }
    }, 1000);
  }

  onCodeInput(event: any): void {
    // Permitir solo números
    const value = event.target.value;
    this.verificationCode = value.replace(/\D/g, '').slice(0, 6);
  }

  goToLogin(): void {
    // Limpiar email pendiente
    localStorage.removeItem('pendingEmail');
    this.router.navigate(['/auth/login']);
  }

  goToRegister(): void {
    // Limpiar email pendiente
    localStorage.removeItem('pendingEmail');
    this.router.navigate(['/auth/register']);
  }
}