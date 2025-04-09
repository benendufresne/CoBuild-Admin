import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsService } from '../../service/cms.service';
import { CmsDetailsComponent } from '../../component/cms-details/cms-details.component';
import { CONTENT_TYPES} from '../../../../constants/constant';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule,CmsDetailsComponent],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
  constructor(private _cms:CmsService){}
  
  ngOnInit(){
    this._cms.currentTab = CONTENT_TYPES.PRIVACY_POLICY;
  }

}
