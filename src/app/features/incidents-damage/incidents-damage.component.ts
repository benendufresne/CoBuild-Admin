import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-incidents-damage',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './incidents-damage.component.html',
  styleUrl: './incidents-damage.component.scss'
})
export class IncidentsDamageComponent {

}
