import { Routes } from '@angular/router';
import { authGuard } from '../guards/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path:'login', loadComponent: () => import('../components/login/login/login.component').then(m => m.LoginComponent), title: 'Login'},
  { path: 'form', loadComponent: () => import('../components/form/form.component').then(m => m.FormComponent), title: 'Form', canActivate: [authGuard] },
  { path: 'table', loadComponent: () => import('../components/table/table.component').then(m => m.TableComponent), title: 'Table', canActivate: [authGuard] },
];
