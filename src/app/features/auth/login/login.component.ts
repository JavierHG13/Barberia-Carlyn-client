import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { SocialAuthService, GoogleSigninButtonModule, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, GoogleSigninButtonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Login implements OnInit, OnDestroy {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private socialAuthService: SocialAuthService
  ) {}

  ngOnInit(): void {
    // Escuchar cambios en el estado de autenticación de Google
    this.socialAuthService.authState
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        if (user && user.idToken) {
          this.handleGoogleLogin(user.idToken);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onLogin(): void {
    this.errorMessage = '';

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
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log('Error en login:', error);
        this.isLoading = false;

        if (error.error?.message) {
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

  signInWithGoogle(): void {
    this.socialAuthService
      .signIn(GoogleLoginProvider.PROVIDER_ID)
      .then(() => {
        console.log('Autenticación con Google iniciada');
      })
      .catch((error) => {
        console.error('Error al iniciar sesión con Google:', error);
        this.errorMessage = 'Error al conectar con Google';
        this.cdr.detectChanges();
      });
  }

  goToRegistro(): void {
    this.router.navigate(['/auth/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}