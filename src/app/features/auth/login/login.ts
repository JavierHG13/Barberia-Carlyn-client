import { Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class Login {
  email: string = '';
  password: string = '';

  constructor(private router: Router) {}

  onLogin() {
    // Prototipo sin funcionalidad real
    console.log('Login:', this.email, this.password);
    this.router.navigate(['/home']);
  }

  goToRegistro() {
    this.router.navigate(['/auth/register']);
  }
}