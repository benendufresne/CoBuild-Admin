import { Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { MatTableRenderComponent } from "src/app/components/mat-table-render";
import { Pagination } from "src/app/constants/pagination";
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
import { BC_CATEGORY } from "src/app/constants/breadcrumb-routes";
import { USER_TYPES } from "src/app/constants/constant";
import { CATEGORY_HEADING } from "src/app/constants/table-heading";

import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { ButtonComponent } from "src/app/components/button/button.component";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { MatIconModule } from "@angular/material/icon";
import { RequestManagementService } from "src/app/features/request-management/service/request-management.service";
import { ApiResponse } from "src/app/constants/interface";
import { firstValueFrom } from "rxjs";
import { API_STATUS } from "src/app/constants/number";
import { MatDialog } from "@angular/material/dialog";
import { AddEditComponent } from "../add-edit/add-edit.component";
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
    MatIconModule,
  ],
  templateUrl: "./listing.component.html",
  styleUrl: "./listing.component.scss",
})
export class ListingComponent extends Pagination implements OnInit {
  fromDate;
  toDate;
  searchkey = "";
  ftype: number = 1;
  reset: boolean = false;
  sortType = 0;
  Sortby: string = "created";
  applySorting: boolean = false;
  filterForm!: FormGroup;
  filterRedDot: boolean = false;
  downloadUrl: string = "";
  checkFormValue: boolean = false;
  @ViewChild(MatTableRenderComponent) tableRef!: MatTableRenderComponent;
  placeholderText = TABLE_SEACRCH_PLACEHOLDER.CATEGORY_SEARCH_PLACEHOLDER;
  actionButtons = [];
  category;
  public userTypes = USER_TYPES;
  public actionInprogress = false;
  public heading = [...CATEGORY_HEADING];
  public customButtonConst = CUSTOM_BUTTON_CONST;
  public isAddEditAccess: boolean = true;
  constructor(
    private readonly _requestService: RequestManagementService,
    private _table: TableService,
    private _fb: FormBuilder,
    private readonly _dialog: MatDialog,
    private readonly _toastService: ToastService,
    private readonly _commonService: CommonService,
    private readonly _breadcrumbService: BreadcrumbService
  ) {
    super();
  }
  ngOnInit(): void {
    this._requestService.getSearchCategoryData().subscribe((res) => {
      this.searchkey = res;
    });
    if (!this.searchkey) {
      this.getListing();
    }
    this.createForm();
    this._breadcrumbService.setBreadcrumb(BC_CATEGORY);
    this.permissionHandler();
  }
  dateInput(event) {
    event.preventDefault();
  }

  createForm() {
    this.filterForm = this._fb.group({
      fromDate: [""],
      toDate: [""],
    });
  }
  get f() {
    return this.filterForm.controls;
  }
  permissionHandler() {
    let permission = this._commonService.getPermissionByModuleId(
      MODULE_ID_OF.REQUEST_MANAGEMENT
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
        this._requestService.setSearchCategoryData(this.search);
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
      case 8:
        this.deleteCategory(status);
        break;
    }
  }
  async deleteCategory(status) {
    this.actionInprogress = true;
    const data = {
      name: status.data?.name,
      categoryId: status.data._id,
      status: this.API_EVENT.DELETED,
    };
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._requestService.editCategory(data)
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

  async fetchData(params: any, isExport: boolean = false) {
    if (this.searchkey) params["searchKey"] = this.searchkey;
    if (this.reset) {
      delete params["searchKey"];
      delete params["startFromDate"];
      delete params["startToDate"];
    }

    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._requestService.getCategoryList(params)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.reset = false;
        this.category = responseData.data;
        this._table.tableRender({ list: responseData.data, ...responseData });
        this.actionInprogress = false;
      }
    } catch (error) {
      this._table.tableRender({ list: [] });
      this._toastService.error(error.message);
      this.checkFormValue = false;
      this.category = [];
      this.actionInprogress = false;
    }
  }

  getListing(value?) {
    const params = { ...this.validPageOptions, ...value };
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

  resetList() {
    this.fromDate = "";
    this.toDate = "";
    this.searchkey = "";
    this.reset = true;
    this.getListing();
  }

  onView(event: any) {
    if (event) {
      const dialog = this._dialog.open(AddEditComponent, {
        panelClass: "account-popup",
        width: "480px",
        data: event,
      });
      dialog.afterClosed().subscribe((result) => {
        if (result) {
          this.getListing();
        }
      });
    }
  }
}
