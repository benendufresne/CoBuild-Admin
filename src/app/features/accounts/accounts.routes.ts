import { Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import {
  FORGOT_PASSWORD,
  FORGOT_PASSWORD_SUCCESSFULL,
  LOGIN,
  RESET_PASSWORD,
  RESET_PASSWORD_SUCCESSFULL,
} from 'src/app/constants/routes';

export const ACCOUNT_ROUTES: Routes = [
  {
    path: '',
    component: AccountsComponent,
    children: [
      { path: '', redirectTo: LOGIN.path, pathMatch: 'full' },
      {
        path: LOGIN.path,
        loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
      },
      {
        path: FORGOT_PASSWORD.path,
        loadComponent: () => import('./pages/forgot-password/forgot-password.component').then((m) => m.ForgotPasswordComponent),
      },
      {
        path: FORGOT_PASSWORD_SUCCESSFULL.path,
        loadComponent: () =>
          import(
            "./pages/forgot-password-sucess/forgot-password-sucess.component"
          ).then((m) => m.ForgotPasswordSucessComponent),
      },
      {
        path: `${RESET_PASSWORD.path}`,
        loadComponent: () =>
          import("./pages/reset-password/reset-password.component").then(
            (m) => m.ResetPasswordComponent
          ),
      },
      {
        path: RESET_PASSWORD_SUCCESSFULL.path,
        loadComponent: () =>
          import(
            "./pages/reset-password-success/reset-password-success.component"
          ).then((m) => m.ResetPasswordSuccessComponent),
      },
    ],
  },
];
