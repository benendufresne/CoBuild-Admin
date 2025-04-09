import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CmsEditorComponent } from '../cms-editor/cms-editor.component';
import { DataLoaderComponent } from '../../../../components/data-loader/data-loader.component';
import { SafePipe } from '../../../../pipes/safe/safe.pipe';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../../services/common/common.service';
import { CmsService } from '../../service/cms.service';
import {  CONTENT_TYPES } from '../../../../constants/constant';
import { ApiResponse, IStaticContent } from '../../../../constants/interface';
import { STRING_CONST } from '../../../../constants/string';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { CUSTOM_BUTTON_CONST } from 'src/app/constants/actionbutton-constant';
import {  BC_CMS_CUSTOMER } from 'src/app/constants/breadcrumb-routes';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { TrimHTMLPipe } from 'src/app/pipes/trimHTML/trim-html.pipe';
import { MODULE_ID_OF } from 'src/app/constants/messages';
import { isObjEmpty } from 'src/app/constants/helper';

const MODULES = [
  MatIconModule,
  MatTooltipModule,
  CmsEditorComponent,
  DataLoaderComponent,
  SafePipe,
  ButtonComponent,
  TrimHTMLPipe
];

@Component({
  selector: 'app-cms-details',
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: './cms-details.component.html',
  styleUrls: ['./cms-details.component.scss']
})
export class CmsDetailsComponent {

  subscriptions: Subscription[] = [];
  contentData: IStaticContent;
  isApiCallInProgress = false;
  edit: boolean = false;
  keys = STRING_CONST;
  customButtonConst = CUSTOM_BUTTON_CONST;
  @Input() currentUrl: String;
  isAddEditAccess:boolean=true;
  constructor(
    private _common: CommonService,
    private _cms: CmsService,
    private _bc: BreadcrumbService,
    private _commonService:CommonService
  ) { }
  ngOnInit() {
   this._bc.setBreadcrumb(BC_CMS_CUSTOMER)
    this.getContent();
    this.permissionHandler();
  }

  getContent() {
    if (this._cms.currentTab != CONTENT_TYPES.FAQS) {
      this.getContentData();
    }
  }
  getContentData() {
    this.isApiCallInProgress = true;
    let params = {
      type: this._cms.currentTab,
    }
    this.subscriptions.push(
      this._cms.getCmsContents(params).subscribe({
        next: (res: ApiResponse<IStaticContent>) => {
          if (res && res.data) {
            this.contentData = res.data;
            this.isApiCallInProgress = false;
          }
        },
        error: (error) => {
          this.isApiCallInProgress = false;
        }
      })
    );
  }
    permissionHandler() {
      let permission = this._commonService.getPermissionByModuleId(
        MODULE_ID_OF.STATIC_CONTENT_MANAGEMENT
      );
      if (!isObjEmpty(permission)) {
        if (!permission.edit) {
          this.isAddEditAccess = false;
        }
      }
    }
  optionChange() {
    this.getContent();
  }

  ShowDetails(event) {
    if (!event) {
      this.edit = !this.edit;
   this._bc.setBreadcrumb(BC_CMS_CUSTOMER)
      this.getContent();
    }
  }
  onEdit() {
    this.edit = true;
    if (this.subscriptions.length > 0) {
      this._common.unsubscribe(this.subscriptions);
    }
  }

  /**
  * @UNSUBSCRIPTION Unsubscribe all subscriptions to avoid memory leak
  */
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this._common.unsubscribe(this.subscriptions);
    }
  }

}
