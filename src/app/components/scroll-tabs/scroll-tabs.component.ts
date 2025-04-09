import {
  Component,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CmsService } from 'src/app/features/cms/service/cms.service';


const MODULES = [
  MatTabsModule,
  RouterOutlet,
  RouterModule,
]

@Component({
  selector: 'app-scroll-tabs',
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: './scroll-tabs.component.html',
  styleUrls: ['./scroll-tabs.component.scss'],
})
export class ScrollTabsComponent {
  @Input() public ptabs: string[] = [];
  constructor(public _cmsService: CmsService){}
}
