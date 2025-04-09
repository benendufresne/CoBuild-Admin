import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SUB_ADMIN_TAB_LINKS_CUSTOMERS } from 'src/app/constants/constant';

@Component({
  selector: 'app-listing',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent {
  tabs: Array<any> = SUB_ADMIN_TAB_LINKS_CUSTOMERS;

}
