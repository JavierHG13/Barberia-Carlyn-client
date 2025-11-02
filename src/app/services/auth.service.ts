import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

export interface User {
  id: number;
  nombreCompleto: string;
  correoElectronico: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterData {
  nombreCompleto: string;
  correoElectronico: string;
  telefono: string;
  contrasena: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    // Cargar usuario del localStorage al iniciar
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // LOGIN
  login(correoElectronico: string, contrasena: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, {
        correoElectronico,
        contrasena,
      })
      .pipe(
        tap((response) => {
          this.saveAuthData(response.token, response.user);
        })
      );
  }

  // REGISTRO
  register(data: RegisterData): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/register`, data);
  }

  // VERIFICAR EMAIL
  verifyEmail(code: string): Observable<{ message: string; user?: User }> {
    const correoElectronico = localStorage.getItem('pendingEmail');
    if (!correoElectronico) {
      throw new Error('No hay email pendiente de verificación');
    }

    return this.http.post<{ message: string; user?: User }>(`${this.apiUrl}/verify-email`, {
      correoElectronico,
      code,
    });
  }

  // REENVIAR CÓDIGO DE VERIFICACIÓN
  resendCode(): Observable<{ message: string }> {
    const correoElectronico = localStorage.getItem('pendingEmail');
    if (!correoElectronico) {
      throw new Error('No hay email pendiente de verificación');
    }

    return this.http.post<{ message: string }>(`${this.apiUrl}/resend-code`, {
      correoElectronico,
    });
  }

  // LOGIN CON GOOGLE
  googleAuth(googleToken: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/google`, {
        googleToken,
      })
      .pipe(
        tap((response) => {
          this.saveAuthData(response.token, response.user);
        })
      );
  }

  // OLVIDÉ MI CONTRASEÑA
  forgotPassword(correoElectronico: string): Observable<{ message: string }> {
    // Guardar email para usar en los siguientes pasos
    localStorage.setItem('recoveryEmail', correoElectronico);

    return this.http.post<{ message: string }>(`${this.apiUrl}/forgot-password`, {
      correoElectronico,
    });
  }

  // VERIFICAR CÓDIGO DE RECUPERACIÓN
  verifyRecoveryCode(code: string): Observable<{ message: string }> {
    const correoElectronico = localStorage.getItem('recoveryEmail');
    if (!correoElectronico) {
      throw new Error('No hay solicitud de recuperación activa');
    }

    return this.http.post<{ message: string }>(`${this.apiUrl}/verify-recovery-code`, {
      code,
      correoElectronico,
    });
  }

  // RESETEAR CONTRASEÑA
  resetPassword(newPassword: string): Observable<{ message: string }> {
    const correoElectronico = localStorage.getItem('recoveryEmail');

    if (!correoElectronico) {
      throw new Error('No hay solicitud de recuperación activa');
    }

    return this.http
      .post<{ message: string }>(`${this.apiUrl}/reset-password`, {
        newPassword,
        correoElectronico,
      })
      .pipe(
        tap(() => {
          // Limpiar email de recuperación después de resetear
          localStorage.removeItem('recoveryEmail');
        })
      );
  }

  // REENVIAR CÓDIGO DE RECUPERACIÓN
  resendRecoveryCode(): Observable<{ message: string }> {
    const correoElectronico = localStorage.getItem('recoveryEmail');
    if (!correoElectronico) {
      throw new Error('No hay solicitud de recuperación activa');
    }

    return this.http.post<{ message: string }>(`${this.apiUrl}/resend-recovery-code`, {
      correoElectronico,
    });
  }

  // OBTENER PERFIL
  getProfile(): Observable<{ message: string; user: User }> {
    return this.http.get<{ message: string; user: User }>(`${this.apiUrl}/profile`);
  }

  // GUARDAR DATOS DE AUTENTICACIÓN
  private saveAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  // LOGOUT
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  // VERIFICAR SI ESTÁ AUTENTICADO
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  // OBTENER TOKEN
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // OBTENER USUARIO ACTUAL
  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}
