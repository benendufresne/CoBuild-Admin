import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CmsDetailsComponent } from '../../component/cms-details/cms-details.component';
import { CmsService } from '../../service/cms.service';
import { CONTENT_TYPES } from 'src/app/constants/constant';

@Component({
  selector: 'app-about-us',
  standalone: true,
  imports: [CommonModule,CmsDetailsComponent],
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss'
})
export class AboutUsComponent {
  constructor(private _cms:CmsService){}
  
  ngOnInit(){
    this._cms.currentTab = CONTENT_TYPES.ABOUT_US;
  }
}
