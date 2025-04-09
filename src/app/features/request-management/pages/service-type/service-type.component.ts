import {
  Component,
  OnInit,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { MatTableRenderComponent } from "src/app/components/mat-table-render";
import { Pagination } from "src/app/constants/pagination";
import { firstValueFrom } from "rxjs";
import { TableService } from "src/app/components/mat-table-render/table.service";
import { CommonService } from "src/app/services/common/common.service";
import { TABLE_SEACRCH_PLACEHOLDER } from "src/app/constants/messages";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatButtonModule } from "@angular/material/button";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { MatRadioModule } from "@angular/material/radio";
import {  BC_TYPE } from "src/app/constants/breadcrumb-routes";
import { API_STATUS } from "src/app/constants/number";
import { ApiResponse, IsTableFiltered } from "src/app/constants/interface";
import { USER_TYPES } from "src/app/constants/constant";
import { TYPE_HEADING } from "src/app/constants/table-heading";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { ButtonComponent } from "src/app/components/button/button.component";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { MatIconModule } from "@angular/material/icon";
import { RequestManagementService } from "../../service/request-management.service";
import { AddEditTypeComponent } from "./add-edit-type/add-edit-type.component";
import { MatDialog } from "@angular/material/dialog";
import { isEmpty } from "src/app/constants/helper";
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
  selector: "app-service-type",
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
  templateUrl: "./service-type.component.html",
  styleUrl: "./service-type.component.scss",
})
export class ServiceTypeComponent extends Pagination implements OnInit {
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
  placeholderText = TABLE_SEACRCH_PLACEHOLDER.TYPE_SEARCH_PLACEHOLDER;
  actionButtons = [];
  language;
  category;
  public userTypes = USER_TYPES;
  public actionInprogress = false;
  public heading = [...TYPE_HEADING];
  public customButtonConst = CUSTOM_BUTTON_CONST;
  filterAdded: boolean = false;
  filterValues: any = {};
  renderInitialData: boolean = true;
  initialSearch;

  constructor(
    public _requestService: RequestManagementService,
    private _table: TableService,
    private _fb: FormBuilder,
    private readonly _toastService: ToastService,
    private readonly _commonService: CommonService,
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _dialog: MatDialog
  ) {
    super();
    this._requestService.getSearchTypeData().subscribe((res) => {
      this.searchkey = res;
      this.initialSearch = res;
    });
  }
  async ngOnInit(): Promise<void> {
    this.createForm();
    if (!this.searchkey) {
      this.saveFilter();
    }

    this._breadcrumbService.setBreadcrumb(BC_TYPE);
  }
  dateInput(event) {
    event.preventDefault();
  }
  saveFilter() {
    this._requestService
      .getIsServiceTypeTableFiltered()
      .subscribe((data: IsTableFiltered) => {
        if (
          !this.filterAdded &&
          data.isFiltered &&
          data.listName === "serviceType"
        ) {
          this.filterAdded = true;
          this.renderInitialData = false;
          if (
            "categoryId" in data.values &&
            Array.isArray(data.values.categoryId)
          ) {
            this.patchFormArray("categoryId", data.values.categoryId);
          }
          this.filterForm.updateValueAndValidity();
          this.filterRedDot = true;
          this.checkFormValue = true;
          this.filterValues = Object.fromEntries(
            Object.entries(data.values).filter(
              ([_, value]) => value !== "" && value !== null
            )
          );
          this.getListing(this.filterValues);
        }
      });
    if (this.renderInitialData) {
      this.getListing(this.filterValues);
    }
  }

  createForm() {
    this.filterForm = this._fb.group({
      categoryId: this._fb.array([]),
    });
  }
  get f() {
    return this.filterForm?.controls;
  }
  subscribeToFilterFormChanges(value?) {
    this.filterForm.patchValue(value);
    this.filterForm.markAsDirty();
    const isFormEmpty = Object.values(this.filterForm.controls).every(
      (control) => isEmpty(control)
    );
    this.checkFormValue = !isFormEmpty;
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
          this._requestService.setSearchTypeData(this.search);
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
    this._requestService
      .getIsServiceTypeTableFiltered()
      .subscribe((res: any) => {
        isFiltered = res.isFiltered;
      });
    if (isFiltered && this.initialSearch) {
      this.saveFilter();
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
        this.deleteType(status);
        break;
    }
  }
  async deleteType(status) {
    this.actionInprogress = true;
    const data = {
      serviceId: status.data._id,
      status: this.API_EVENT.DELETED,
    };
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._requestService.editServiceType(data)
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


  async fetchData(params: any) {
    if (this.searchkey) params["searchKey"] = this.searchkey;
    if (params["categoryId"]) {
      params["categoryId"] = params["categoryId"].toString();
    }
    if (this.reset) {
      delete params["searchKey"];
      delete params["categoryId"];
    }
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._requestService.getServiceTypeList(params)
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
  patchFormArray(formArrayName: string, values: string[]) {
    const formArray = this.f[formArrayName] as FormArray;
    if (!formArray) {
      console.error(`FormArray ${formArrayName} does not exist.`);
      return;
    }
    formArray.clear();
    values.forEach((value) => formArray.push(new FormControl(value)));
    formArray.updateValueAndValidity();
  }
  checkFilterFormKeys() {
    if (this.filterOptions["categoryId"]) {
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
      this.filterValues = Object.fromEntries(
        Object.entries(this.filterForm.value).filter(
          ([_, value]) => value !== "" && value !== null
        )
      );
      this.filterAdded = true;
      this._requestService.setIsServiceTypeTableFiltered({
        isFiltered: true,
        listName: "serviceType",
        values: this.filterValues,
      });
      this.filterOptions = this._commonService.changeDateFormat(
        this.filterForm.value
      );
      if (!this.filterOptions["categoryId"]?.length) {
        delete this.filterOptions["categoryId"];
      }
      this.checkFilterFormKeys();
    } else {
      this.category = [];
      this.filterOptions = {};
      this.filterAdded = false;
      this.filterValues = {};
      this.filterForm.reset();
      this.filterRedDot = false;
      this.checkFormValue = false;
      this._requestService.setIsServiceTypeTableFiltered({
        isFiltered: false,
        listName: "",
        values: this.filterForm.value,
      });
      (this.filterForm.controls["categoryId"] as FormArray).clear();
      this.filterForm.get("categoryId") as FormArray;
      setTimeout(() => {
        this.category = [...this._requestService.getCategory()];
      }, 1000);
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
  onCheckboxChange(e, control) {
    const selectedItems: FormArray = this.filterForm.get(control) as FormArray;
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

  onView(event: any) {
    if (event) {
      const dialog = this._dialog.open(AddEditTypeComponent, {
        panelClass: "account-popup",
        width: "480px",
        data: event,
      });
      dialog.afterClosed().subscribe((result) => {
        if (result) {
          this.getListing(this.filterValues);
        }
      });
    }
  }
}
