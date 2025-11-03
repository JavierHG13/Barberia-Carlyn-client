import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule],
  styleUrls: ['./dashboard.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Dashboard implements OnInit {
  userName: string = '';
  userEmail: string = '';
  lastLogin: string = '';
  currentDate: string = '';
  isLoggingOut: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUserData();
    this.setCurrentDate();
  }

  loadUserData(): void {
    const user = this.authService.getCurrentUser();
    
    if (user) {
      this.userName = user.nombreCompleto;
      this.userEmail = user.correoElectronico;
      this.lastLogin = this.getFormattedDate(new Date());
    } else {
      // Si no hay usuario, redirigir al login
      this.router.navigate(['/auth/login']);
    }
  }

  setCurrentDate(): void {
    this.currentDate = this.getFormattedDate(new Date());
  }

  getFormattedDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-MX', options);
  }

  onLogout(): void {
    this.isLoggingOut = true;
    
    // Simular un pequeño delay para mejor UX
    setTimeout(() => {
      this.authService.logout();
      this.isLoggingOut = false;
      // El servicio ya redirige al login
    }, 500);
  }
}