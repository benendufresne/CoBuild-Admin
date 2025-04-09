import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { MatTableRenderComponent } from "src/app/components/mat-table-render";
import { Pagination } from "src/app/constants/pagination";
import { filter, firstValueFrom, tap } from "rxjs";
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
import { BC_REQUEST } from "src/app/constants/breadcrumb-routes";
import { API_STATUS } from "src/app/constants/number";
import { ApiResponse, IsTableFiltered } from "src/app/constants/interface";
import { USER_TYPES } from "src/app/constants/constant";
import { REQUEST_HEADING } from "src/app/constants/table-heading";
import { Router } from "@angular/router";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { MatIconModule } from "@angular/material/icon";
import { RequestManagementService } from "../../service/request-management.service";
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
  placeholderText = TABLE_SEACRCH_PLACEHOLDER.REQUEST_SEARCH_PLACEHOLDER;
  actionButtons = [];
  language;
  filterAdded: boolean = false;
  filterValues: any = {};
  renderInitialData: boolean = true;
  isAddEditAccess: boolean = true;
  initialSearch;
  public userTypes = USER_TYPES;
  public actionInprogress = false;
  public heading = [...REQUEST_HEADING];
  public customButtonConst = CUSTOM_BUTTON_CONST;
  constructor(
    public _requestService: RequestManagementService,
    private _table: TableService,
    private _fb: FormBuilder,
    private _router: Router,
    private readonly _toastService: ToastService,
    private readonly _commonService: CommonService,
    private readonly _breadcrumbService: BreadcrumbService,
    private cdr: ChangeDetectorRef
  ) {
    super();
    this._requestService.getSearchRequestData().subscribe((res) => {
      this.searchkey = res;
      this.initialSearch = res;
    });
  }
  ngOnInit(): void {
    this.createForm();
    this._breadcrumbService.setBreadcrumb(BC_REQUEST);
    if (!this.searchkey) {
      this.saveFilter();
    }
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
  saveFilter() {
    this._requestService
      .getIsRequestTableFiltered()
      .pipe(
        filter(
          (data) =>
            !this.filterAdded &&
            data.isFiltered &&
            data.listName === "requestList"
        ),
        tap(() => {
          this.filterAdded = true;
          this.renderInitialData = false;
          this.filterRedDot = true;
          this.checkFormValue = true;
        })
      )
      .subscribe((data: IsTableFiltered) => {
        const { fromDate: from, toDate: to, ...otherValues } = data.values;

        const fromDate = from ? new Date(from) : null;
        const toDate = to ? new Date(to) : null;

        // Adjust end-of-day time for the same-day filter range
        if (
          fromDate &&
          toDate &&
          fromDate.toDateString() === toDate.toDateString()
        ) {
          toDate.setHours(23, 59, 59, 999);
        }

        // Update the form with new dates
        this.filterForm.patchValue({ fromDate, toDate });

        this.cdr.detectChanges();
        this.filterForm.updateValueAndValidity();

        // Prepare filter values including timestamps
        this.filterValues = {
          ...otherValues,
          ...(fromDate && { fromDate: fromDate.getTime() }),
          ...(toDate && { toDate: toDate.getTime() }),
        };
        this.getListing(this.filterValues);
      });

    if (this.renderInitialData) {
      this.getListing(this.filterValues);
    }
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

  removeOnlyAddBtn() {
    this.permissionClass = this._commonService.getClassToRemoveAddBtn();
  }
  paginationWithSearch(ev: any, id: number) {
    switch (id) {
      case 0:
        this.resetPages();
        if (this.initialSearch !== ev) {
          this.search = ev;
          this._requestService.setSearchRequestData(this.search);

          if (this.filterValues && Object.keys(this.filterValues).length > 0) {
            this.getListingWithSearch();
          } else {
            this.getListingWithSearch();
          }

          if (this.tableRef.paginator) {
            this.tableRef.paginator.firstPage();
          }
        }
        break;

      default:
        this.pageOptionsOnChange = ev;
        break;
    }
    let isFiltered;
    this._requestService.getIsRequestTableFiltered().subscribe((res: any) => {
      isFiltered = res.isFiltered;
    });
    if (isFiltered && this.initialSearch) {
      this.saveFilter();
    }
    if ((id = 1)) {
      this.getListing();
    }
  }

  getListingWithSearch() {
    const params = {
      ...this.filterValues,
    };
    this.getListing(params);
  }

  resetPage() {
    this.pageNo = 1;
    this.nextHit = 0;
  }
  changeStatus(status: any) {
    switch (status.id) {
      case 8:
        this.deleteRequest(status);
        break;
    }
  }
  async deleteRequest(status) {
    this.actionInprogress = true;
    const data = {
      reqId: status.data._id,
      status: this.API_EVENT.DELETED,
    };
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._requestService.editRequest(data)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.getListing(this.filterValues);
        this._toastService.success(responseData.message);
      }
    } catch (error) {
      this.actionInprogress = false;
      this._toastService.error(error.message);
    }
  }

  async fetchData(params: any) {
    if (this.searchkey) params["searchKey"] = this.searchkey;
    if (this.reset) {
      delete params["searchKey"];
      delete params["startFromDate"];
      delete params["startToDate"];
    }

    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._requestService.getRequestList(params)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.reset = false;
        this._table.tableRender({ list: responseData.data, ...responseData });
        this.actionInprogress = false;
      }
    } catch (error) {
      this._table.tableRender({ list: [] });
      this._toastService.error(error.message);
      this.checkFormValue = false;
      this.actionInprogress = false;
    }
  }

  getListing(values: any = {}) {
    const params = { ...this.validPageOptions, ...values };
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
  checkFilterFormKeys() {
    if (this.filterOptions["fromDate"] || this.filterOptions["toDate"]) {
      this.filterRedDot = true;
      this.checkFormValue = true;
      return;
    }
    this.filterRedDot = false;
    this.checkFormValue = false;
  }
  filterApply(event: any) {
    if (!this.filterForm.dirty && !this.filterAdded) {
      this.filterRedDot = false;
      this.checkFormValue = false;
      return;
    }
    if (event.apply) {
      this.filterRedDot = true;
      this.filterAdded = true;
      this.filterValues = Object.fromEntries(
        Object.entries(this.filterForm.value).filter(
          ([_, value]) => value !== "" && value !== null
        )
      );
      this._requestService.setIsRequestTableFiltered({
        isFiltered: true,
        listName: "requestList",
        values: this.filterForm.value,
      });
      this.filterOptions = this._commonService.changeDateFormat(
        this.filterValues
      );

      this.checkFilterFormKeys();
    } else {
      this.filterOptions = {};
      this.filterValues = {};
      this.filterForm.reset();
      this.filterRedDot = false;
      this.checkFormValue = false;
      this.filterAdded = false;

      this._requestService.setIsRequestTableFiltered({
        isFiltered: false,
        listName: "",
        values: this.filterForm.value,
      });
    }
    this.resetPages();
    if (this.tableRef.paginator) {
      this.tableRef.paginator.firstPage();
    }
    this.getListing(this.filterValues);
  }
  resetList() {
    this.fromDate = "";
    this.toDate = "";
    this.searchkey = "";
    this.reset = true;
    this.getListing(this.filterValues);
  }
}
