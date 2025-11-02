import { Routes } from '@angular/router';
import { Home } from './features/home/home';
import { Servicios } from './features/servicios/servicios';
import { Dashboard } from './features/dashboard/dashboard';

export const routes: Routes = [
  { path: '', component: Home },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth-module').then(m => m.AuthModule)
  },
  { path: 'servicios', component: Servicios },
  { path: 'dashboard', component: Dashboard },
  { path: '**', redirectTo: '' } 
];