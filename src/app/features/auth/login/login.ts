import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Login {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router,  private cdr: ChangeDetectorRef) {}

  onLogin(): void {
    // Limpiar mensaje de error
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
        console.log('✅ Login exitoso:', response);
        this.isLoading = false; // IMPORTANTE: desactivar loading

        // Redirigir al dashboard o página principal
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.log('❌ Error en login:', error);
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

  goToRegistro(): void {
    this.router.navigate(['/auth/register']);
  }

  goToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
