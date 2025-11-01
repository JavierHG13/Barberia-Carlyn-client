import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-servicios',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './servicios.html',
  styleUrls: ['./servicios.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Servicios {
  
  categoriaActiva: string = 'todos';

  categorias = [
    { id: 'todos', nombre: 'Todos los Servicios', icono: 'apps-outline' },
    { id: 'cortes', nombre: 'Cortes', icono: 'cut-outline' },
    { id: 'barba', nombre: 'Barba', icono: 'man-outline' },
    { id: 'especiales', nombre: 'Especiales', icono: 'sparkles-outline' }
  ];

  servicios = [
    {
      id: 1,
      categoria: 'cortes',
      nombre: 'Corte Clásico',
      descripcion: 'Corte tradicional de caballero con tijera y máquina. Incluye lavado y peinado.',
      precio: 250,
      duracion: '30 min',
      icono: 'cut-outline',
      popular: true
    },
    {
      id: 2,
      categoria: 'cortes',
      nombre: 'Corte Moderno',
      descripcion: 'Estilos actuales y tendencias. Fade, undercut y más. Incluye lavado y styling.',
      precio: 280,
      duracion: '40 min',
      icono: 'cut-outline',
      popular: true
    },
    {
      id: 3,
      categoria: 'cortes',
      nombre: 'Corte Niño',
      descripcion: 'Corte especial para niños hasta 12 años. Ambiente amigable y rápido.',
      precio: 180,
      duracion: '25 min',
      icono: 'happy-outline',
      popular: false
    },
    {
      id: 4,
      categoria: 'barba',
      nombre: 'Arreglo de Barba',
      descripcion: 'Perfilado y recorte de barba. Incluye productos hidratantes premium.',
      precio: 150,
      duracion: '20 min',
      icono: 'man-outline',
      popular: false
    },
    {
      id: 5,
      categoria: 'barba',
      nombre: 'Barba Completa',
      descripcion: 'Diseño, perfilado y tratamiento completo. Incluye aceites y bálsamos.',
      precio: 200,
      duracion: '30 min',
      icono: 'man-outline',
      popular: true
    },
    {
      id: 6,
      categoria: 'barba',
      nombre: 'Afeitado Clásico',
      descripcion: 'Afeitado tradicional con navaja. Incluye toallas calientes y aftershave.',
      precio: 180,
      duracion: '25 min',
      icono: 'cut-outline',
      popular: false
    },
    {
      id: 7,
      categoria: 'especiales',
      nombre: 'Combo Premium',
      descripcion: 'Corte + Barba + Afeitado. El paquete completo del caballero.',
      precio: 400,
      duracion: '60 min',
      icono: 'ribbon-outline',
      popular: true
    },
    {
      id: 8,
      categoria: 'especiales',
      nombre: 'Tinte de Cabello',
      descripcion: 'Aplicación de tinte profesional. Cubre canas y da color uniforme.',
      precio: 350,
      duracion: '50 min',
      icono: 'color-palette-outline',
      popular: false
    },
    {
      id: 9,
      categoria: 'especiales',
      nombre: 'Tinte de Barba',
      descripcion: 'Tinte especializado para barba. Color natural y duradero.',
      precio: 200,
      duracion: '35 min',
      icono: 'color-palette-outline',
      popular: false
    },
    {
      id: 10,
      categoria: 'especiales',
      nombre: 'Tratamiento Capilar',
      descripcion: 'Tratamiento revitalizante para el cuero cabelludo. Productos premium.',
      precio: 300,
      duracion: '45 min',
      icono: 'sparkles-outline',
      popular: false
    },
    {
      id: 11,
      categoria: 'especiales',
      nombre: 'Masaje Capilar',
      descripcion: 'Masaje relajante con aceites esenciales. Reduce el estrés.',
      precio: 150,
      duracion: '20 min',
      icono: 'hand-left-outline',
      popular: false
    },
    {
      id: 12,
      categoria: 'cortes',
      nombre: 'Diseño Artístico',
      descripcion: 'Diseños y figuras personalizadas en cabello. Arte capilar.',
      precio: 350,
      duracion: '50 min',
      icono: 'brush-outline',
      popular: false
    }
  ];

  constructor(private router: Router) {}

  get serviciosFiltrados() {
    if (this.categoriaActiva === 'todos') {
      return this.servicios;
    }
    return this.servicios.filter(s => s.categoria === this.categoriaActiva);
  }

  cambiarCategoria(categoriaId: string) {
    this.categoriaActiva = categoriaId;
  }

  agendarServicio(servicio: any) {
    console.log('Agendando:', servicio.nombre);
    this.router.navigate(['/agendar']);
  }
}