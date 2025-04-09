import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-request-management',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './request-management.component.html',
  styleUrl: './request-management.component.scss'
})
export class RequestManagementComponent {

}
