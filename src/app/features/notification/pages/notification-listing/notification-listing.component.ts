import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { firstValueFrom } from "rxjs";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { ButtonComponent } from "src/app/components/button/button.component";
import { MatTableRenderComponent } from "src/app/components/mat-table-render";
import { TableService } from "src/app/components/mat-table-render/table.service";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { BC_NOTIFICATION } from "src/app/constants/breadcrumb-routes";
import { isObjEmpty, unavailableDates } from "src/app/constants/helper";
import { ApiResponse } from "src/app/constants/interface";
import { MODULE_ID_OF, TABLE_SEACRCH_PLACEHOLDER } from "src/app/constants/messages";
import { API_STATUS, NUMBER_CONST } from "src/app/constants/number";
import { Pagination } from "src/app/constants/pagination";
import { NOTIFICATION_LISTING_HEADING } from "src/app/constants/table-heading";
import { CommonService } from "src/app/services/common/common.service";
import {
  NOTIFICATION_TYPE_ARRAY,
  NOTIFICATION_USERS,
} from "src/app/constants/constant";
import { NoLeadingSpaceDirective } from "src/app/directives/no-leading-space/no-leading-space.directive";
import { OnlyNumberDirective } from "src/app/directives/only-number/only-number.directive";
import { LIMIT } from "src/app/constants/validators";
import {
  ADD_NOTIFICATION,
  POST_DETAILS,
  VIEW_NOTIFICATION,
} from "src/app/constants/routes";
import { Router } from "@angular/router";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { NotificationService } from "../../_services/notification.service";
export const MY_FORMATS = {
  parse: {
    dateInput: "DD/MM/YYYY",
  },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "DD/MM/YYYY",
    monthYearA11yLabel: "MM YYYY",
  },
};
const MODULE = [
  MatExpansionModule,
  MatTableRenderComponent,
  MatExpansionModule,
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatRadioModule,
  ButtonComponent,
  NoLeadingSpaceDirective,
  OnlyNumberDirective,
  MatCheckboxModule,
];
@Component({
  selector: "app-notification-listing",
  standalone: true,
  imports: [CommonModule, ...MODULE],
  templateUrl: "./notification-listing.component.html",
  styleUrls: ["./notification-listing.component.scss"],
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class NotificationListingComponent extends Pagination {
  public filterForm!: FormGroup;
  public checkFormValue: boolean = false;
  private reset: boolean = false;
  public heading = [...NOTIFICATION_LISTING_HEADING];
  public placeholderText =
    TABLE_SEACRCH_PLACEHOLDER.NOTIFICATION_LIST_B_PINS_PLACEHOLDER;
  public filterRedDot: boolean = false;
  private searchkey: string;
  private statusKey: string;
  public users: Array<any> = NOTIFICATION_USERS;
  public customButtonConst = CUSTOM_BUTTON_CONST;
  public unavailableDates = unavailableDates;
  public notificationTypeArray = [...NOTIFICATION_TYPE_ARRAY];
  public limits = LIMIT;
  public numberConst = NUMBER_CONST;
  public postOfTheMonthId: any;
  showMat = true;
  isAddEditAccess: boolean = true;
  @ViewChild(MatTableRenderComponent)
  private tableRef!: MatTableRenderComponent;
  @ViewChild("minInput") minInput: ElementRef;
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private readonly _tableService: TableService,
    private readonly _toastService: ToastService,
    private readonly _commonService: CommonService,
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _notificationService: NotificationService
  ) {
    super();
    this._breadcrumbService.setBreadcrumb(BC_NOTIFICATION);
    this.createForm();
    this.getNotificationListing();
    this.permissionHandler();
  }

  createForm() {
    this.filterForm = this._formBuilder.group({
      users: this._formBuilder.array([]),
      fromDate: [""],
      toDate: [""],
    });
  }

  get f() {
    return this.filterForm.controls;
  }

  permissionHandler() {
    let permission = this._commonService.getPermissionByModuleId(
      MODULE_ID_OF.NOTIFICATION_MANAGEMENT
    );
    if (!isObjEmpty(permission)) {
      if (!permission.edit) {
        this.removeActionObj();
        this.isAddEditAccess = false;
      }
    }
  }
  removeActionObj() {
    this.heading.splice(this.heading.length - 1, 1);
  }

  subscribeToFilterFormChanges(value?) {
    this.filterForm.patchValue(value);
    this.filterForm.markAsDirty();
    this.checkFormValue = Boolean(
      Object.values(this.filterForm.value).some(
        (value) => value !== false && value !== ""
      )
    );
  }

  async getNotificationListing() {
    const params = { ...this.params };
    if (this.searchkey) params["searchKey"] = this.searchkey;
    if (params["users"]) {
      params["users"] = params["users"].toString();
    }
    if (this.reset) {
      delete params["searchKey"];
      delete params["users"];
      delete params["startFromDate"];
      delete params["startToDate"];
    }
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._notificationService.getNotificationListing(params)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.reset = false;
        this._tableService.tableRender({
          list: responseData.data.data,
          ...responseData.data,
        });
      }
    } catch (error) {
      this._tableService.tableRender({ list: [] });
      this._toastService.error(error.message);
    }
  }

  paginationWithSearch(ev: any, id: number) {
    switch (id) {
      case NUMBER_CONST.ZERO:
        this.resetPages();
        this.search = ev;
        if (this.tableRef.paginator) {
          this.tableRef.paginator.firstPage();
        }
        this.getNotificationListing();
        break;
      default:
        this.pageOptionsOnChange = ev;
        this.getNotificationListing();
        break;
    }
  }

  filterApply(event: any) {
    if (!this.filterForm.dirty) {
      this.filterRedDot = false;
      this.checkFormValue = false;
      return;
    }
    if (event.apply) {
      this.filterRedDot = true;
      const formVal = this.filterForm.value;
      this.filterOptions = this._commonService.changeDateFormat(
        this.filterForm.value
      );
      if (!this.filterOptions["users"]?.length) {
        delete this.filterOptions["users"];
      }
      this.checkFilterFormKeys();
    } else {
      this.users = [];
      this.filterOptions = {};
      this.filterForm.reset();
      this.filterRedDot = false;
      this.checkFormValue = false;
      (this.filterForm.controls["users"] as FormArray).clear();
      const selectedItems: FormArray = this.filterForm.get(
        "users"
      ) as FormArray;
      setTimeout(() => {
        this.users = [...NOTIFICATION_USERS];
      }, 1000);
    }
    this.resetPages();
    if (this.tableRef.paginator) {
      this.tableRef.paginator.firstPage();
    }
    this.getNotificationListing();
  }
  changeStatus(status: any) {
    switch (status.id) {
      case 5:
        this.updateStatus(status);
        break;
      case 7:
        this.resendNotification(status);
        break;
    }
  }
  async updateStatus(status) {
    const data = {
      notificationId: status.data._id,
      status: "DELETED",
    };

    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._notificationService.editNotification(data)
      );
      if (responseData.statusCode === API_STATUS.TWO_ZERO_TWO) {
        this._toastService.success(responseData.message);
        this.getNotificationListing();
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }
  async resendNotification(status) {
    const data = {
      notificationId: status.data._id,
    };

    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._notificationService.resendNotification(data)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._toastService.success(responseData.message);
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }

  checkFilterFormKeys() {
    if (this.filterOptions["users"]) {
      this.filterRedDot = true;
      this.checkFormValue = true;
      return;
    }
    if (this.filterOptions["fromDate"] || this.filterOptions["toDate"]) {
      this.filterRedDot = true;
      this.checkFormValue = true;
      return;
    }
    this.filterRedDot = false;
    this.checkFormValue = false;
  }
  dateInput(event) {
    event.preventDefault();
  }

  onView(event: any) {
    this._router.navigate([
      VIEW_NOTIFICATION.fullUrl,
      this._commonService.encryption(event),
    ]);
  }

  onCheckboxChange(e) {
    const selectedItems: FormArray = this.filterForm.get("users") as FormArray;
    if (e.checked) {
      selectedItems.push(new FormControl(e.source.value));
    } else {
      const index = selectedItems.controls.findIndex(
        (x) => x.value === e.source.value
      );
      selectedItems.removeAt(index);
    }
    this.subscribeToFilterFormChanges();
  }
  navigateToAddNotification() {
    this._router.navigate([ADD_NOTIFICATION.fullUrl]);
  }
}
