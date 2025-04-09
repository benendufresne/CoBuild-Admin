import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [
    CommonModule,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    RouterOutlet,
  ],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  // providers: [VerifyRouteResolveService],
})
export class AccountsComponent {}
