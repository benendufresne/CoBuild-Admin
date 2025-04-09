import { Routes } from '@angular/router';

export const DB_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./dashboard.component').then((c) => c.DashboardComponent),
  },
];

