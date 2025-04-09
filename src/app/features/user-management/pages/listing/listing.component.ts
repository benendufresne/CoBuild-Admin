import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { MatTableRenderComponent } from "src/app/components/mat-table-render";
import { Pagination } from "src/app/constants/pagination";
import { firstValueFrom } from "rxjs";
import { TableService } from "src/app/components/mat-table-render/table.service";
import { CommonService } from "src/app/services/common/common.service";
import {
  MODULE_ID_OF,
  TABLE_SEACRCH_PLACEHOLDER,
} from "src/app/constants/messages";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { MatRadioModule } from "@angular/material/radio";
import { BC_USERS } from "src/app/constants/breadcrumb-routes";
import { API_STATUS, NUMBER_CONST } from "src/app/constants/number";
import { ApiResponse } from "src/app/constants/interface";
import { USER_TYPES } from "src/app/constants/constant";
import {
  BLOCKED_USER_HEADING,
  USER_LISTING_CUSTOMERS_HEADING,
} from "src/app/constants/table-heading";
import { Router } from "@angular/router";
import { CREATE_USER } from "src/app/constants/routes";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { ButtonComponent } from "src/app/components/button/button.component";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { UserManagementService } from "../../service/user-management.service";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { STRING_CONST } from "src/app/constants/string";
import { MatIconModule } from "@angular/material/icon";
import { isObjEmpty } from "src/app/constants/helper";
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
@Component({
  selector: "app-listing",
  standalone: true,
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  imports: [
    CommonModule,
    MatTableRenderComponent,
    MatCheckboxModule,
    MatExpansionModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatRadioModule,
    MatButtonModule,
    ButtonComponent,
    DataLoaderComponent,
    MatIconModule,
  ],
  templateUrl: "./listing.component.html",
  styleUrl: "./listing.component.scss",
})
export class ListingComponent extends Pagination implements OnInit, OnDestroy {
  fromDate;
  toDate;
  searchkey = "";
  statusKey = "";
  ftype: number = 1;
  reset: boolean = false;
  sortType = 0;
  Sortby: string = "created";
  applySorting: boolean = false;
  filterForm!: FormGroup;
  filterRedDot: boolean = false;
  downloadUrl: string = "";
  checkFormValue: boolean = false;
  heading: any;
  @ViewChild(MatTableRenderComponent) tableRef!: MatTableRenderComponent;
  placeholderText = TABLE_SEACRCH_PLACEHOLDER.USER_MANAGEMENT_CUSTOMERS_SEACRCH;
  actionButtons = [];
  language;
  public userTypes = USER_TYPES;
  public actionInprogress = false;
  public allowAccess = true;
  public customButtonConst = CUSTOM_BUTTON_CONST;
  constructor(
    public _userService: UserManagementService,
    private _table: TableService,
    private _fb: FormBuilder,
    private _router: Router,
    private readonly _toastService: ToastService,
    private readonly _commonService: CommonService,
    private readonly _breadcrumbService: BreadcrumbService
  ) {
    super();
  }
  ngOnInit(): void {
    this.setTableInfo();
    this.getListing();
    this.createForm();
    this.permissionHandler();
  }
  dateInput(event) {
    event.preventDefault();
  }

  createForm() {
    this.filterForm = this._fb.group({
      status: [""],
      unblocked: [""],
      fromDate: [""],
      toDate: [""],
    });
  }
  get f() {
    return this.filterForm.controls;
  }
  subscribeToFilterFormChanges(value?) {
    this.filterForm.patchValue(value);
    this.checkFormValue = Boolean(
      Object.values(this.filterForm.value).some(
        (value) => value !== false && value !== ""
      )
    );
  }

  unavailableDates(calendarDate: Date): boolean {
    return calendarDate <= new Date();
  }
  permissionHandler() {
    let permission = this._commonService.getPermissionByModuleId(
      MODULE_ID_OF.USER_MANAGEMENT
    );
    if (!isObjEmpty(permission)) {
      if (!permission.edit) {
        this.removeActionObj();
        this.allowAccess = false;
      }
    }
  }

  removeActionObj() {
    BLOCKED_USER_HEADING.splice(BLOCKED_USER_HEADING.length - 1, 1);
    USER_LISTING_CUSTOMERS_HEADING.splice(
      USER_LISTING_CUSTOMERS_HEADING.length - 1,
      1
    );
  }
  paginationWithSearch(ev: any, id: number) {
    switch (id) {
      case 0:
        this.resetPages();
        this.search = ev;
        if (this.tableRef.paginator) {
          this.tableRef.paginator.firstPage();
        }
        break;
      default:
        this.pageOptionsOnChange = ev;
        break;
    }
    this.getListing();
  }

  resetPage() {
    this.pageNo = 1;
    this.nextHit = 0;
  }
  changeStatus(status: any) {
    switch (status.id) {
      case 4:
        this.updateStatus(status);
        break;
      case 8:
        this.deleteUser(status);
        break;
      case 9:
        this.updateStatus(status);
        break;
    }
  }
  async deleteUser(status) {
    this.actionInprogress = true;
    const data = {
      userId: status.data._id,
      type: this.API_EVENT.DELETED,
    };
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._userService.updateUserStatus(data)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.getListing();
        this._toastService.success(responseData.message);
      }
    } catch (error) {
      this.actionInprogress = false;
      this._toastService.error(error.message);
    }
  }

  async updateStatus(status) {
    this.actionInprogress = true;
    const data = {
      userId: status.data._id,
      type:
        status.data.status === this.API_EVENT.inactive
          ? this.API_EVENT.active
          : this.API_EVENT.inactive,
    };
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._userService.updateUserStatus(data)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._toastService.success(responseData.message);
        this.getListing();
      }
    } catch (error) {
      this.actionInprogress = false;
      this._toastService.error(error.message);
    }
  }

  async fetchData(params: any, isExport: boolean = false) {
    if (this.searchkey) params["searchKey"] = this.searchkey;
    if (this.statusKey) params["status"] = this.statusKey;
    if (this.reset) {
      delete params["searchKey"];
      delete params["status"];
      delete params["startFromDate"];
      delete params["startToDate"];
      delete params["renewalFromDate"];
      delete params["renewalToDate"];
    }
    if (this._userService.userTableType === this.userTypes.USERS) {
      params["status"] = this.API_EVENT.block;
    }
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._userService.getUserList(params)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.reset = false;
        if (isExport && responseData && responseData.data) {
          // this.downloadUrl = `https://${responseData.data}`;
          // this.triggerDownload();
          this._toastService.success(responseData.message);
        } else {
          this._table.tableRender({ list: responseData.data, ...responseData });
        }
        this.actionInprogress = false;
      }
    } catch (error) {
      this._table.tableRender({ list: [] });
      this._toastService.error(error.message);
      this.checkFormValue = false;
      this.actionInprogress = false;
    }
  }

  getListing() {
    const params = { ...this.validPageOptions };
    this.setDateParams(params, "start");
    this.setDateParams(params, "renewal");
    this.fetchData(params);
  }

  // New helper function to set date parameters
  private setDateParams(params: any, prefix: string) {
    const fromDateKey = `${prefix}FromDate`;
    const toDateKey = `${prefix}ToDate`;

    if (this[fromDateKey] || this[toDateKey]) {
      params[fromDateKey] = this[fromDateKey];
      params[toDateKey] = this[toDateKey];
    }
  }

  sortByListing(event: any) {
    let header = this.heading.find((head) => head.key === event);
    this.sortOrder =
      header.sortOrder === NUMBER_CONST.ONE
        ? NUMBER_CONST.MINUS_ONE
        : NUMBER_CONST.ONE;
    header.sortOrder =
      header.sortOrder === NUMBER_CONST.ONE
        ? NUMBER_CONST.MINUS_ONE
        : NUMBER_CONST.ONE;
    this.sortBy = event;
    this.getListing();
  }
  checkFilterFormKeys() {
    if (this.filterOptions["status"]) {
      this.filterRedDot = true;
      this.checkFormValue = true;
      return;
    }
    if (this.filterOptions["status"] && this.filterOptions["unblocked"]) {
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
      if (!this.filterOptions["status"]?.length) {
        delete this.filterOptions["status"];
      }
      this.checkFilterFormKeys();
    } else {
      this.filterOptions = {};
      this.filterForm.reset();
      this.filterRedDot = false;
      this.checkFormValue = false;
    }
    this.resetPages();
    if (this.tableRef.paginator) {
      this.tableRef.paginator.firstPage();
    }
    this.getListing();
  }

  export() {
    const params = { ...this.validPageOptions, isExport: true };
    this.setDateParams(params, "start");
    this.setDateParams(params, "renewal");
    this.fetchData(params, true);
  }

  triggerDownload() {
    if (this.downloadUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = this.downloadUrl;
      downloadLink.download = "users_1733826808625.csv";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }
  resetList() {
    this.fromDate = "";
    this.toDate = "";
    this.statusKey = "";
    this.searchkey = "";
    this.reset = true;
    this.getListing();
  }
  userTableChanged(type: string) {
    if (this._userService.userTableType !== type) {
      this._userService.userTableType = type;
      this.filterOptions = {};
      this.search = "";
      this.filterForm.reset();
      this.filterRedDot = false;
      this.checkFormValue = false;
      this.resetPages();
      if (this.tableRef.paginator) {
        this.tableRef.paginator.firstPage();
      }
      this.setTableInfo();
      this.resetList();
    }
  }

  setTableInfo() {
    this.sortType = 0;
    this.Sortby = "created";
    this.actionInprogress = true;
    const isBlockedUsers =
      this._userService.userTableType === this.userTypes.USERS;
    this.heading = isBlockedUsers
      ? BLOCKED_USER_HEADING
      : USER_LISTING_CUSTOMERS_HEADING;

    this._breadcrumbService.setBreadcrumb(isBlockedUsers ? [] : BC_USERS);
    this.actionInprogress = false;
    this.heading.forEach((head) => {
      head.sortBy = head.key === this.Sortby ? 0 : null;
    });
  }

  onView(event: any) {
    if (event === STRING_CONST.ADD) {
      this._router.navigateByUrl(CREATE_USER.fullUrl);
    }
  }
  ngOnDestroy(): void {
    this._userService.userTableType = "";
  }
}
