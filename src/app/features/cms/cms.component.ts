import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  RouterOutlet } from '@angular/router';
import { ScrollTabsComponent } from '../../components/scroll-tabs/scroll-tabs.component';
import { CMS_TAB_LINKS_CUSTOMERS } from '../../constants/constant';

const MODULES = [
  RouterOutlet,
  ScrollTabsComponent
]

@Component({
  selector: 'app-cms',
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss']
})
export class CmsComponent {
  tabs: Array<any> = CMS_TAB_LINKS_CUSTOMERS;
}
