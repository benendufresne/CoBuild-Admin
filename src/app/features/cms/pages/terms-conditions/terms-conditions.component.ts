import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsService } from '../../service/cms.service';
import { CONTENT_TYPES } from '../../../../constants/constant';
import { CmsDetailsComponent } from '../../component/cms-details/cms-details.component';

@Component({
  selector: 'app-terms-conditions',
  standalone: true,
  imports: [CommonModule,CmsDetailsComponent],
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent {
  constructor(private _cms:CmsService){}
  
  ngOnInit(){
    this._cms.currentTab = CONTENT_TYPES.TERMS_CONDITIONS;
  }

}
