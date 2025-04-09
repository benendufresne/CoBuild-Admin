import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-sub-admin',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterModule],
  templateUrl: './sub-admin.component.html',
  styleUrls: ['./sub-admin.component.scss']
})
export class SubAdminComponent{

}
