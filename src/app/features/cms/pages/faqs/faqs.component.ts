import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { EmptyValuePipe } from '../../../../pipes/empty-value/empty-value.pipe';
import { DataLoaderComponent } from '../../../../components/data-loader/data-loader.component';
import { DATE_TYPES, LISTING_COMMON_MESSAGES, MODULE_ID_OF } from '../../../../constants/messages';
import { CmsService } from '../../service/cms.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../../../components/toast-notification/toast.service';
import { ConfirmationModalComponent } from '../../../../components/confirmation-modal/confirmation-modal.component';
import { AddEditFaqsComponent } from './add-edit-faqs/add-edit-faqs.component';
import { Pagination } from '../../../../constants/pagination';
import { ApiResponse, IFaqs } from '../../../../constants/interface';
import { CONTENT_TYPES } from '../../../../constants/constant';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../../services/common/common.service';
import { STRING_CONST } from '../../../../constants/string';
import { BreadcrumbService } from '../../../../components/breadcrumb/breadcrumb.service';
import { BC_CMS_CUSTOMER } from '../../../../constants/breadcrumb-routes';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { QuillModule } from 'ngx-quill';
import { FormsModule } from '@angular/forms';
import { isObjEmpty } from 'src/app/constants/helper';

const MODULES = [
  MatIconModule,
  MatTooltipModule,
  MatButtonModule,
  EmptyValuePipe,
  DataLoaderComponent,
  ButtonComponent,
  QuillModule,
  FormsModule
]

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: './faqs.component.html',
  styleUrls: ['./faqs.component.scss']
})
export class FaqsComponent extends Pagination {

  faqList: Array<IFaqs> = [];
  dateType = DATE_TYPES;
  isApiCallInProgress: boolean = false;
  isAddEditAccess:boolean=true;
  subscriptions: Subscription[] = [];
  stringConst = STRING_CONST;
  public modules = {
    formula: false,
    toolbar: false,
  };
  constructor(
    private cms: CmsService,
    private _dialog: MatDialog,
    private _toast: ToastService,
    public _common: CommonService,
    private _bc:BreadcrumbService
  ) {
    super();
  }
  ngOnInit() {
    this.cms.currentTab = CONTENT_TYPES.FAQS;
    this._bc.setBreadcrumb(BC_CMS_CUSTOMER)
    this.getFaqListing();
    this.permissionHandler();
  }
  permissionHandler() {
    let permission = this._common.getPermissionByModuleId(
      MODULE_ID_OF.STATIC_CONTENT_MANAGEMENT
    );
    if (!isObjEmpty(permission)) {
      if (!permission.edit) {
        this.isAddEditAccess = false;
      }
    }
  }
  getFaqListing() {
    this.isApiCallInProgress = true;
    let params = {
      pageNo:'1',
      limit:'100',
    }
    this.cms.getfaqList(params).subscribe({
      next: (res: ApiResponse<Array<IFaqs | null>>) => {
        this.isApiCallInProgress = false;
        if (res && res.data) {
          this.faqList = res.data || [];
        }
      },
      error: (err) => this.isApiCallInProgress = false
    });
  }
  AddEditFaq(status?) {
    let faqData = status;
    const dialog = this._dialog.open(AddEditFaqsComponent, {
      panelClass: "account-popup",
      data: faqData,
    });
    dialog.afterClosed().subscribe((res: boolean) => {
      if (res) {
        this.unsubscribe();
        this.getFaqListing();
      }
    });
  }
  confirmationDialog(element) {
    const dialog = this._dialog.open(ConfirmationModalComponent, {
      panelClass: "account-popup",
      width: "480px",
      data: {
        title: `${LISTING_COMMON_MESSAGES.DELETE_TITLE} FAQ`,
        message: `${LISTING_COMMON_MESSAGES.DELETE_MSG} this FAQ?`,
      },
    });
    dialog.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.onDeleteAction(element);
      }
    });
  }
  onDeleteAction(ele) {
    this.cms.deleteFaq({ [this.stringConst.FAQ_ID]: ele[this.stringConst.ID] }).subscribe((res: ApiResponse) => {
      this._toast.success(res.message);
      this.unsubscribe();
      this.getFaqListing();
    });
  }

  unsubscribe() {
    if (this.subscriptions.length > 0) {
      this._common.unsubscribe(this.subscriptions);
    }
  }

  /**
  * @UNSUBSCRIPTION Unsubscribe all subscriptions to avoid memory leak
  */
  ngOnDestroy() {
    this.unsubscribe();
  }

}
