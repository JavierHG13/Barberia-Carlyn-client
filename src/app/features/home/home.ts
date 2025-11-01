import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Home {
  
  caracteristicas = [
    {
      icono: 'cut-outline',
      titulo: 'Cortes Profesionales',
      descripcion: 'Estilos clásicos y modernos adaptados a tu personalidad'
    },
    {
      icono: 'calendar-outline',
      titulo: 'Agenda Online',
      descripcion: 'Reserva tu cita en cualquier momento y desde cualquier lugar'
    },
    {
      icono: 'people-outline',
      titulo: 'Barberos Expertos',
      descripcion: 'Profesionales con años de experiencia en el arte de la barbería'
    },
    {
      icono: 'star-outline',
      titulo: 'Productos Premium',
      descripcion: 'Utilizamos solo los mejores productos para el cuidado masculino'
    }
  ];

  serviciosDestacados = [
    {
      nombre: 'Corte Clásico',
      descripcion: 'El corte tradicional de caballero',
      precio: '$250',
      icono: 'cut-outline'
    },
    {
      nombre: 'Barba y Bigote',
      descripcion: 'Perfilado y arreglo completo',
      precio: '$180',
      icono: 'cut-outline'
    },
    {
      nombre: 'Combo Premium',
      descripcion: 'Corte + Barba + Afeitado',
      precio: '$400',
      icono: 'sparkles-outline'
    }
  ];

  testimonios = [
    {
      nombre: 'Roberto Sánchez',
      comentario: 'El mejor lugar para un corte de caballero. Profesionalismo y calidad garantizada.',
      estrellas: 5
    },
    {
      nombre: 'Miguel Torres',
      comentario: 'Ambiente tradicional con servicios modernos. Siempre salgo satisfecho.',
      estrellas: 5
    },
    {
      nombre: 'Carlos Hernández',
      comentario: 'La atención es excelente y los barberos son verdaderos artistas.',
      estrellas: 5
    }
  ];

  constructor(private router: Router) {}

  agendarCita() {
    this.router.navigate(['/agendar']);
  }

  verServicios() {
    this.router.navigate(['/servicios']);
  }
}