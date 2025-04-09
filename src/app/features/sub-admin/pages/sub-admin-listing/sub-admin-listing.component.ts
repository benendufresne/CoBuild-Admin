import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatTableRenderComponent } from "src/app/components/mat-table-render";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { firstValueFrom, Subscription } from "rxjs";
import {
  MODULE_ID_OF,
  TABLE_ADD_BUTTON_TEXT,
  TABLE_SEACRCH_PLACEHOLDER,
} from "src/app/constants/messages";
import { Pagination } from "src/app/constants/pagination";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { SubAdminService } from "../../service/sub-admin/sub-admin.service";
import { TableService } from "src/app/components/mat-table-render/table.service";
import { CommonService } from "src/app/services/common/common.service";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { Router, RouterModule } from "@angular/router";
import { dateToMs, isObjEmpty } from "src/app/constants/helper";
import { CREATE_SUBADMIN, EDIT_SUBADMIN } from "src/app/constants/routes";
import { BC_SUBADMIN } from "src/app/constants/breadcrumb-routes";
import { MatRadioModule } from "@angular/material/radio";
import { SUB_ADMIN_HEADING } from "src/app/constants/table-heading";
import { ButtonComponent } from "src/app/components/button/button.component";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { ApiResponse } from "src/app/constants/interface";
import { API_STATUS, NUMBER_CONST } from "src/app/constants/number";
const MODULES = [
  MatTableRenderComponent,
  MatCheckboxModule,
  MatExpansionModule,
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatDatepickerModule,
  MatRadioModule,
  RouterModule,
  ButtonComponent,
];
@Component({
  selector: "app-sub-admin-listing",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./sub-admin-listing.component.html",
  styleUrls: ["./sub-admin-listing.component.scss"],
})
export class SubAdminListingComponent
  extends Pagination
  implements OnInit, OnDestroy
{
  addButtonText = TABLE_ADD_BUTTON_TEXT.SUB_ADMIN;

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
  dateValidation = {
    maxTodate: new Date(),
    maxFromDate: new Date(),
    minToDate: new Date(1900, 0, 1),
    minFromDate: new Date(1900, 0, 1),
  };
  heading = [...SUB_ADMIN_HEADING];
  @ViewChild(MatTableRenderComponent)
  tableRef!: MatTableRenderComponent;
  subscriptions: Subscription[] = [];
  tempList = [];
  placeholderText = TABLE_SEACRCH_PLACEHOLDER.SUB_ADMIN_SEARCH_PLACEHOLDER;
  public customButtonConst = CUSTOM_BUTTON_CONST;
  checkFormValue: boolean = false;
  isAddEditAccess: boolean = true;
  constructor(
    private _breadcrumbService: BreadcrumbService,
    private _subAdminService: SubAdminService,
    private _table: TableService,
    private _common: CommonService,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _router: Router
  ) {
    super();
  }
  ngOnInit(): void {
    this._breadcrumbService.setBreadcrumb(BC_SUBADMIN);
    this.getListing();
    this.createForm();
    this.permissionHandler();
  }
  dateInput(event) {
    event.preventDefault();
  }

  selectFromFilter() {
    this.dateValidation.minToDate = this.filterForm.value["fromDate"];
  }

  selectToFilter() {
    this.dateValidation.maxFromDate = this.filterForm.value["toDate"];
  }
  subscribeToFilterFormChanges(value?) {
    this.filterForm.patchValue(value);
    this.checkFormValue = Boolean(
      Object.values(this.filterForm.value).some(
        (value) => value !== false && value !== ""
      )
    );
  }

  async getListing() {
    let params = {
      ...this.validPageOptions,
    };
    // delete params["sortBy"];
    // delete params["sortOrder"];
    if (this.searchkey) {
      params["searchKey"] = this.searchkey;
    }
    if (this["fromDate"] || this["toDate"]) {
      params["fromDate"] = this["fromDate"];
      params["toDate"] = this["toDate"];
    }
    if (this.statusKey) {
      params["status"] = this.statusKey;
    }
    if (this.applySorting) {
      params["sortOrder"] = this.sortType;
    }
    if (this.Sortby) {
      params["sortBy"] = this.Sortby;
    }
    if (this.reset) {
      delete params["searchKey"];
      delete params["status"];
      delete params["fromDate"];
      delete params["toDate"];
    }
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._subAdminService.getSubAdminList(params)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.reset = false;
        this._table.tableRender({
          list: responseData.data,
          ...responseData,
        });
      }
    } catch (error) {
      this._table.tableRender({ list: [] });
      this._toast.error(error.message);
      this.checkFormValue = false;
    }
  }
  createForm() {
    this.filterForm = this._fb.group({
      status: [],
      blocked: [false],
      unblocked: [false],
      pending: [false],
      fromDate: [""],
      toDate: [""],
      allLanguage: [false],
    });
  }
  permissionHandler() {
    let permission = this._common.getPermissionByModuleId(
      MODULE_ID_OF.SUB_ADMIN_MANAGEMENT
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
  add() {
    return this._router.navigate([CREATE_SUBADMIN.fullUrl]);
  }
  edit(event) {
    this._router.navigate([
      EDIT_SUBADMIN.fullUrl,
      this._common.encryption(event.element._id),
    ]);
  }
  changeStatus(status: any) {
    switch (status.id) {
      case 4:
        this.updateStatus(status);
        break;
      case 5:
        this.updateStatus(status);
        break;
    }
  }
  updateStatus(status) {
    const data = {
      subAdminId: status.data._id,
      status:
        status.id == 5
          ? "DELETED"
          : status.data.status === "BLOCKED"
          ? "UN_BLOCKED"
          : "BLOCKED",
    };
    this.subscriptions.push(
      this._subAdminService.EditSubAdmin(data).subscribe((res) => {
        this._toast.success(res.message);
        this.getListing();
      })
    );
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
    if (
      this.filterOptions["blocked"] &&
      this.filterOptions["pending"] &&
      this.filterOptions["unblocked"]
    ) {
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
      this.filterOptions = this._common.changeDateFormat(this.filterForm.value);
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

  resetList(data) {
    this["fromDate"] = "";
    this["toDate"] = "";
    this.statusKey = "";
    this.searchkey = "";
    this.reset = true;
    this.reset = true;
    this.getListing();
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
