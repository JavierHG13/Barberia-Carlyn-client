import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Subject, takeUntil } from 'rxjs';

declare const google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Login implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  isBlocked: boolean = false;
  remainingTime: number = 0;
  private destroy$ = new Subject<void>();
  private countdownInterval: any;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.initializeGoogleSignIn();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  initializeGoogleSignIn(): void {
    if (typeof google !== 'undefined') {
      google.accounts.id.initialize({
        client_id: '96794615283-7rirdmj84i343p903gmilur3lklnf6kq.apps.googleusercontent.com',
        callback: (response: any) => this.handleGoogleCallback(response),
      });

      google.accounts.id.renderButton(
        document.querySelector('.google-button-wrapper'),
        {
          type: 'standard',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          theme: 'outline',
          logo_alignment: 'left',
        }
      );
    }
  }

  handleGoogleCallback(response: any): void {
    if (response.credential) {
      this.handleGoogleLogin(response.credential);
    }
  }

  onLogin(): void {
    this.errorMessage = '';

    // Si está bloqueado, no permitir login
    if (this.isBlocked) {
      return;
    }

    // Validar campos
    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor completa todos los campos';
      return;
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor ingresa un correo válido';
      return;
    }

    this.isLoading = true;

    // Llamar al servicio de autenticación
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        console.log('Login exitoso:', response);
        this.isLoading = false;
        this.isBlocked = false;
        this.remainingTime = 0;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log('Error en login:', error);
        this.isLoading = false;

        // Manejar bloqueo por demasiados intentos
        if (error.status === 429) {
          this.handleBlockedAccount(error.error?.message);
        } else if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else if (error.status === 401) {
          this.errorMessage = 'Credenciales incorrectas';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Intenta nuevamente.';
        }

        console.log('📝 Error actualizado:', this.errorMessage);
        this.cdr.detectChanges();
      },
    });
  }

  handleBlockedAccount(message: string): void {
    // Extraer el tiempo restante del mensaje
    const timeMatch = message.match(/(\d+)\s+segundos/);
    if (timeMatch) {
      this.remainingTime = parseInt(timeMatch[1]);
      this.isBlocked = true;
      this.startCountdown();
    }
    this.errorMessage = message;
  }

  startCountdown(): void {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }

    this.countdownInterval = setInterval(() => {
      this.remainingTime--;
      
      if (this.remainingTime <= 0) {
        this.isBlocked = false;
        this.errorMessage = '';
        clearInterval(this.countdownInterval);
      } else {
        this.errorMessage = `Demasiados intentos fallidos. Intenta de nuevo en ${this.remainingTime} segundos`;
      }
      
      this.cdr.detectChanges();
    }, 1000);
  }

  handleGoogleLogin(googleToken: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService
      .googleAuth(googleToken)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          console.log('Login con Google exitoso:', response);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Error al iniciar sesión con Google';
          console.error('Error en Google login:', error);
          this.cdr.detectChanges();
        },
      });
  }

  goToRegistro(): void {
    this.router.navigate(['/auth/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}