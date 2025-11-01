import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
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
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
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
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, {
      correoElectronico,
      contrasena
    }).pipe(
      tap(response => {
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
    return this.http.post<{ message: string; user?: User }>(
      `${this.apiUrl}/verify-email`, 
      { code }
    );
  }

  // REENVIAR CÓDIGO DE VERIFICACIÓN
  resendCode(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/resend-code`, {});
  }

  // LOGIN CON GOOGLE
  googleAuth(googleToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/google`, {
      googleToken
    }).pipe(
      tap(response => {
        this.saveAuthData(response.token, response.user);
      })
    );
  }

  // OLVIDÉ MI CONTRASEÑA
  forgotPassword(correoElectronico: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password`,
      { correoElectronico }
    );
  }

  // VERIFICAR CÓDIGO DE RECUPERACIÓN
  verifyRecoveryCode(code: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/verify-recovery-code`,
      { code }
    );
  }

  // RESETEAR CONTRASEÑA
  resetPassword(newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      { newPassword }
    );
  }

  // REENVIAR CÓDIGO DE RECUPERACIÓN
  resendRecoveryCode(): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/resend-recovery-code`,
      {}
    );
  }

  // OBTENER PERFIL
  getProfile(): Observable<{ message: string; user: User }> {
    return this.http.get<{ message: string; user: User }>(
      `${this.apiUrl}/profile`
    );
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