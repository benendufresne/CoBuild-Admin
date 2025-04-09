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
import {
  BUTTON_TYPE_CONST,
  CUSTOM_BUTTON_CONST,
} from "src/app/constants/actionbutton-constant";
import { BC_JOB } from "src/app/constants/breadcrumb-routes";
import {
  isEmpty,
  isObjEmpty,
  unavailableDates,
} from "src/app/constants/helper";
import { ApiResponse } from "src/app/constants/interface";
import {
  MODULE_ID_OF,
  TABLE_SEACRCH_PLACEHOLDER,
} from "src/app/constants/messages";
import { API_STATUS, NUMBER_CONST } from "src/app/constants/number";
import { Pagination } from "src/app/constants/pagination";
import { JOB_HEADING } from "src/app/constants/table-heading";
import { CommonService } from "src/app/services/common/common.service";
import {
  JOB_STATUS_TYPE,
  JOB_STATUS_TYPE_ARRAY,
  PRIORITY_LEVEL,
} from "src/app/constants/constant";
import { LIMIT } from "src/app/constants/validators";
import { Router } from "@angular/router";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import * as _moment from "moment";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import { JobManagementService } from "../../service/job-management.service";
import {
  CREATE_JOB_MANAGEMENT,
  EDIT_JOB_MANAGEMENT,
} from "src/app/constants/routes";
import { MatDialog } from "@angular/material/dialog";
import { ScheduleJobComponent } from "../schedule-job/schedule-job.component";
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
  MatCheckboxModule,
];
@Component({
  selector: "app-listing",
  standalone: true,
  imports: [CommonModule, ...MODULE],
  templateUrl: "./listing.component.html",
  styleUrl: "./listing.component.scss",
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class ListingComponent extends Pagination {
  public filterForm!: FormGroup;
  public checkFormValue: boolean = false;
  private reset: boolean = false;
  public heading = [...JOB_HEADING];
  public placeholderText = TABLE_SEACRCH_PLACEHOLDER.JOB_LIST_PLACEHOLDER;
  public filterRedDot: boolean = false;
  private searchkey: string;
  public priorityLevel: Array<any> = PRIORITY_LEVEL;
  public customButtonConst = CUSTOM_BUTTON_CONST;
  public unavailableDates = unavailableDates;
  public jobStatus = [...JOB_STATUS_TYPE_ARRAY];
  public limits = LIMIT;
  public numberConst = NUMBER_CONST;
  public componentType = BUTTON_TYPE_CONST;
  public dropdownStatus = JOB_STATUS_TYPE;
  showMat = true;
  isAddEditAccess: boolean = true;
  @ViewChild(MatTableRenderComponent)
  private tableRef!: MatTableRenderComponent;
  @ViewChild("minInput") minInput: ElementRef;
  fileToUpload: File | null = null;
  downloadUrl='';
  constructor(
    private _router: Router,
    private _formBuilder: FormBuilder,
    private readonly _tableService: TableService,
    private readonly _toastService: ToastService,
    private readonly _commonService: CommonService,
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _jobService: JobManagementService,
    private readonly _dialog: MatDialog
  ) {
    super();
    this._breadcrumbService.setBreadcrumb(BC_JOB);
    this.createForm();
    this.getPostContentListing();
    this.permissionHandler();
  }

  createForm() {
    this.filterForm = this._formBuilder.group({
      priority: this._formBuilder.array([]),
      fromDate: [""],
      toDate: [""],
      status: this._formBuilder.array([]),
    });
  }

  get f() {
    return this.filterForm.controls;
  }

  subscribeToFilterFormChanges(value?) {
    this.filterForm.patchValue(value);
    this.filterForm.markAsDirty();
    const isFormEmpty = Object.values(this.filterForm.controls).every(
      (control) => isEmpty(control)
    );
    this.checkFormValue = !isFormEmpty;
  }

  permissionHandler() {
    let permission = this._commonService.getPermissionByModuleId(
      MODULE_ID_OF.JOB_MANAGEMENT
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

  async fetchData(params: any, isExport: boolean = false,exportTemplate:boolean = false) {
    if (this.searchkey) params["searchKey"] = this.searchkey;
    if (this.reset) {
      delete params["searchKey"];
      delete params["status"];
      delete params["startFromDate"];
      delete params["startToDate"];
      delete params["renewalFromDate"];
      delete params["renewalToDate"];
    }
    if (params["priority"]) {
      params["priority"] = params["priority"].toString();
    }
    if (params["status"]) {
      params["status"] = params["status"].toString();
    }
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._jobService.getJobsList(params)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.reset = false;
        if (!isExport && !exportTemplate) {
          this._tableService.tableRender({
            list: responseData.data,
            ...responseData,
          });
        }else if(exportTemplate){
        this.downloadUrl = responseData.data;
        this._toastService.success(responseData.message);
          this.triggerDownload();
        }else if(isExport){
          this._toastService.success(responseData.message);
        }
      }
    } catch (error) {
      this._tableService.tableRender({ list: [] });
      this._toastService.error(error.message);
      this.checkFormValue = false;
    }
  }

  getPostContentListing() {
    const params = { ...this.validPageOptions };
    this.setDateParams(params, "start");
    this.setDateParams(params, "renewal");
    this.fetchData(params);
  }
  export() {
    const params = { ...this.validPageOptions, isExport: true };
    this.setDateParams(params, "start");
    this.setDateParams(params, "renewal");
    this.fetchData(params, true);
  }
  templateExport(){
    const params = { ...this.validPageOptions, exportTemplate: true };
    this.setDateParams(params, "start");
    this.setDateParams(params, "renewal");
    this.fetchData(params, false,true);
  }
  private setDateParams(params: any, prefix: string) {
    const fromDateKey = `${prefix}FromDate`;
    const toDateKey = `${prefix}ToDate`;

    if (this[fromDateKey] || this[toDateKey]) {
      params[fromDateKey] = this[fromDateKey];
      params[toDateKey] = this[toDateKey];
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
        this.getPostContentListing();
        break;
      default:
        this.pageOptionsOnChange = ev;
        this.getPostContentListing();
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
      if (!this.filterOptions["priority"]?.length) {
        delete this.filterOptions["priority"];
      }
      if (!this.filterOptions["status"]?.length) {
        delete this.filterOptions["status"];
      }
      this.checkFilterFormKeys();
    } else {
      this.priorityLevel = [];
      this.jobStatus = [];
      this.filterOptions = {};
      this.filterForm.reset();
      this.filterRedDot = false;
      this.checkFormValue = false;
      (this.filterForm.controls["priority"] as FormArray).clear();
      this.filterForm.get("priority") as FormArray;
      setTimeout(() => {
        this.priorityLevel = [...PRIORITY_LEVEL];
      }, 1000);
      (this.filterForm.controls["status"] as FormArray).clear();
      this.filterForm.get("status") as FormArray;
      setTimeout(() => {
        this.jobStatus = [...JOB_STATUS_TYPE_ARRAY];
      }, 1000);
    }
    this.resetPages();
    if (this.tableRef.paginator) {
      this.tableRef.paginator.firstPage();
    }
    this.getPostContentListing();
  }

  checkFilterFormKeys() {
    if (this.filterOptions["priority"]) {
      this.filterRedDot = true;
      this.checkFormValue = true;
      return;
    }
    if (this.filterOptions["fromDate"] || this.filterOptions["toDate"]) {
      this.filterRedDot = true;
      this.checkFormValue = true;
      return;
    }
    if (this.filterOptions["status"]) {
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
      EDIT_JOB_MANAGEMENT.fullUrl,
      this._commonService.encryption(event),
    ]);
  }
  changeStatus(status: any) {
    switch (status.id) {
      case 8:
        this.deleteUser(status);
        break;
      case "dropdown":
        this.updateStatus(status);
        break;
    }
  }
  async updateStatus(status) {
    const data = {
      jobId: status?.jobId,
      status: status?.event?.value,
    };
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._jobService.editJob(data)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._toastService.success(responseData.message);
        this.getPostContentListing();
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }
  handleFileInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const fileType = file.name.split(".").pop()?.toLowerCase();

      if (fileType !== "csv") {
        this._toastService.error("Only .csv files are allowed.");
        input.value = "";
        return;
      }

      this.fileToUpload = file;
      this.importJob();
    }
  }
  async importJob() {
    if (!this.fileToUpload) {
      this._toastService.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", this.fileToUpload, this.fileToUpload.name); // Append the file to FormData

    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._jobService.importJob(formData)
      );
      if (responseData.statusCode === API_STATUS.TWO_ZERO_TWO) {
        this.getPostContentListing();
        this._toastService.success(responseData.message);
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }
  async deleteUser(status) {
    const data = {
      jobId: status.data._id,
      status: this.API_EVENT.DELETED,
    };
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._jobService.editJob(data)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.getPostContentListing();
        this._toastService.success(responseData.message);
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
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
  openScheduleJob() {
    const dialog = this._dialog.open(ScheduleJobComponent, {
      panelClass: "account-popup",
      width: "600px",
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.getPostContentListing();
      }
    });
  }
  navigateToAddJOB() {
    this._router.navigate([CREATE_JOB_MANAGEMENT.fullUrl]);
  }
}
