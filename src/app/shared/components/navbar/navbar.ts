import { Component, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Navbar {
  /*menuItems = [
    { label: 'Inicio', icon: 'home-outline', route: '/home' },
    { label: 'Agendar Cita', icon: 'calendar-outline', route: '/agendar' },
    { label: 'Mis Citas', icon: 'document-text-outline', route: '/mis-citas' },
    { label: 'Servicios', icon: 'cut-outline', route: '/servicios' },
    { label: 'Barberos', icon: 'people-outline', route: '/barberos' },
    { label: 'Reportes', icon: 'bar-chart-outline', route: '/reportes' }
  ];*/
  menuItems = [
    { label: 'Inicio', icon: 'home-outline', route: '/home' },
    { label: 'Servicios', icon: 'cut-outline', route: '/servicios' },
  ];

  isMenuOpen = false;

  constructor(private router: Router) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  login(){
    this.router.navigate(['/auth/login']);
  }
  logout() {
    console.log('Cerrando sesión...');
    this.router.navigate(['/login']);
  }
}