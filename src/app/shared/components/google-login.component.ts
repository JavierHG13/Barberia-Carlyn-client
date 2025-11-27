// google-login.component.ts
import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SocialAuthService, GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-google-login',
  standalone: true, 
  template: `
    <div class="google-login">
      <button (click)="signInWithGoogle()" class="google-btn">
        <img src="https://www.google.com/favicon.ico" alt="Google" />
        Iniciar sesión con Google
      </button>
    </div>
  `,
  styles: [
    `
      .google-login {
        display: flex;
        justify-content: center;
        margin-top: 15px;
      }

      .google-btn {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 20px;
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
        transition: background 0.3s;
      }

      .google-btn:hover {
        background: #f5f5f5;
      }

      .google-btn img {
        width: 20px;
        height: 20px;
      }
    `,
  ],
})
export class GoogleLoginComponent{

  private socialAuthService = inject(SocialAuthService);
  private authService = inject(AuthService);
  private router = inject(Router);

  loading = false;
  private authSubscription?: Subscription;

  constructor() {
    // Escuchar cambios de autenticación de Google
    this.authSubscription = this.socialAuthService.authState.subscribe({
      next: (user) => {
        if (user && user.idToken) {
          this.handleGoogleLogin(user.idToken);
        }
      },
      error: (error) => {
        console.error('Error en authState:', error);
        this.loading = false;
      },
    });
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
  }

  signInWithGoogle(): void {
    this.loading = true;
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).catch((error) => {
      console.error('Error al iniciar Google Sign-In:', error);
      this.loading = false;
      alert('Error al iniciar sesión con Google. Por favor, intenta nuevamente.');
    });
  }

  private handleGoogleLogin(googleToken: string): void {
    if (!googleToken) {
      console.error('No se recibió token de Google');
      this.loading = false;
      return;
    }

    this.authService.googleAuth(googleToken).subscribe({
      next: (response) => {
        console.log('Autenticación exitosa:', response.message);
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en autenticación con Google:', error);
        this.loading = false;
        const errorMessage = error.error?.message || 'Error al iniciar sesión con Google';
        alert(errorMessage);
      },
    });
  }
}
