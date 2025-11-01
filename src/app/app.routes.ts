import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Servicios } from './features/servicios/servicios';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  { path: 'servicios', component: Servicios },
  { path: '**', redirectTo: '' } 
];