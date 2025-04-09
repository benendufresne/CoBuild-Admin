import { Component, OnInit } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { BC_DASHBOARD } from "src/app/constants/breadcrumb-routes";
import { ApiResponse } from "src/app/constants/interface";
import { API_STATUS, NUMBER_CONST } from "src/app/constants/number";
import { DashboardService } from "./_services/dashboard.service";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { CommonModule } from "@angular/common";
import { DashboardCardComponent } from "src/app/components/dashboard-card/dashboard-card.component";
import { ButtonComponent } from "src/app/components/button/button.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { MAT_DATE_FORMATS } from "@angular/material/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import {
  DASHBOARD_FILTER_BUTTON_TYPE,
  DASHBOARD_FILTER_TYPE,
  JOB_STATISTICS,
  USER_STATISTICS,
} from "src/app/constants/constant";
import { LazyImageComponent } from "src/app/components/lazy-image/lazy-image.component";
import { CommonService } from "src/app/services/common/common.service";
import { MODULE_ID_OF } from "src/app/constants/messages";
import { isObjEmpty } from "src/app/constants/helper";

export const MY_FORMATS = {
  parse: { dateInput: "DD/MM/YYYY" },
  display: {
    dateInput: "DD/MM/YYYY",
    monthYearLabel: "MMMM YYYY",
    dateA11yLabel: "DD/MM/YYYY",
    monthYearA11yLabel: "MM YYYY",
  },
};

@Component({
  selector: "app-dashboard",
  standalone: true,
  imports: [
    DataLoaderComponent,
    CommonModule,
    DashboardCardComponent,
    ButtonComponent,
    MatFormFieldModule,
    MatDatepickerModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    LazyImageComponent,
  ],
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
  templateUrl: "./dashboard.component.html",
  styleUrl: "./dashboard.component.scss",
})
export class DashboardComponent implements OnInit {
  dataLoading = true;
  dashboardData: any;
  dashboardFilter = DASHBOARD_FILTER_TYPE;
  duration = this.dashboardFilter.ALL;
  currentDate = new Date();
  date = { fromDate: null, toDate: null };
  downloadUrl: string = "";
  customForm!: FormGroup;
  dateValidation = {
    maxTodate: new Date(),
    maxFromDate: new Date(),
    minToDate: new Date(1900, 0, 1),
    minFromDate: new Date(1900, 0, 1),
  };
  showDateInputs: boolean = false;
  userArray = USER_STATISTICS;
  jobArray = JOB_STATISTICS;
  filterButton = DASHBOARD_FILTER_BUTTON_TYPE;
  isCustomApplied = false;
  isAddEditAccess:boolean=true
  constructor(
    private readonly _toastService: ToastService,
    private readonly _dashboardService: DashboardService,
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _formBuilder: FormBuilder,
    private readonly _commonService:CommonService
  ) {
    this._breadcrumbService.setBreadcrumb(BC_DASHBOARD);
    this.getDashboardData(this.duration);
    this.permissionHandler();
  }

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.customForm = this._formBuilder.group({
      fromDate: ["", Validators.required],
      toDate: ["", Validators.required],
    });
  }

  get customControl() {
    return this.customForm.controls;
  }

  initializeDates(duration: string): void {
    const today = new Date();
    let fromDate = new Date();
    let toDate:any = today;

    switch (duration) {
      case this.dashboardFilter.ALL:
        toDate = today;
        break;
      case this.dashboardFilter.YESTERDAY:
        fromDate.setDate(today.getDate() - 1);
        break;
      case this.dashboardFilter.LAST_WEEK:
        fromDate.setDate(today.getDate() - 7);
        break;
      case this.dashboardFilter.LAST_MONTH:
        fromDate.setMonth(today.getMonth() - 1);
        break;
      case this.dashboardFilter.LAST_YEAR:
        fromDate.setFullYear(today.getFullYear() - 1);
        break;
      case this.dashboardFilter.CUSTOM:
        fromDate = this.customControl["fromDate"].value || this.currentDate;
        toDate = this.customControl["toDate"].value || today;
        break;
      default:
        break;
    }
    this.date = { fromDate, toDate };
  }
  toggleCustomDateInputs() {
    this.showDateInputs = true;
    this.isCustomApplied = false;
    this.customForm?.reset();
  }
  async getDashboardData(
    duration: string,
    isExport: boolean = false
  ): Promise<void> {
    this.initializeDates(duration);
    const params = {
      duration: duration,
      fromDate: this.changeDateFormat(this.date.fromDate),
      toDate: this.changeDateFormat(this.date.toDate, true),
      isExport,
    };

    this.showDateInputs =
      duration === this.dashboardFilter.CUSTOM ? true : false;
    if (this.customForm?.valid) {
      params.fromDate = this.changeDateFormat(
        this.customControl["fromDate"].value
      );
      params.toDate = this.changeDateFormat(
        this.customControl["toDate"].value,
        true
      );
    }

    this.dataLoading = true;
    this.duration = duration;
    if(this.duration ===this.dashboardFilter.ALL){
     params['fromDate'] = 0
    }
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._dashboardService.getDashboard(params)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        if (isExport) {
          this.downloadUrl = `https://${responseData.data}`;
          this.triggerDownload();
        } else {
          this.dashboardData = responseData?.data;
          this.userArray[NUMBER_CONST.ZERO].data = this.dashboardData?.totalUsers;
          this.userArray[NUMBER_CONST.ONE].data = this.dashboardData?.activeUsers;
          this.userArray[NUMBER_CONST.TWO].data =
            this.dashboardData?.blockedUsers;
          this.jobArray[NUMBER_CONST.ZERO].data = this.dashboardData?.totalJobs;
          this.jobArray[NUMBER_CONST.ONE].data = this.dashboardData?.activeJobs;
          this.jobArray[NUMBER_CONST.TWO].data =
            this.dashboardData?.completedJobs;
            this.jobArray[NUMBER_CONST.THREE].data =
            this.dashboardData?.cancelledJobs;
        }
        this.isCustomApplied = true;
      }
    } catch (error) {
      this._toastService.error(error.message);
    } finally {
      this.dataLoading = false;
    }
  }

  changeDateFormat(date: any, isToDate: boolean = false): number | null {
    if (!date) return null;
    const validDate = date instanceof Date ? date : new Date(date);
    if (isToDate) {
      validDate.setHours(23, 59, 59, 999);
    }
    return validDate.getTime();
  }

  isExport(): void {
    this.getDashboardData(
      this.customForm.valid ? this.dashboardFilter.CUSTOM : this.duration,
      true
    );
    this.dataLoading = false;
  }

  triggerDownload(): void {
    if (this.downloadUrl) {
      const downloadLink = document.createElement("a");
      downloadLink.href = this.downloadUrl;
      downloadLink.download = "dashboard_data.csv";
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  }
  async onCustomSubmit(isCustom) {
    this.getDashboardData(isCustom);
  }
  selectFromFilter(): void {
    this.dateValidation.minToDate = this.customForm.value.fromDate;
  }

  selectToFilter(): void {
    this.dateValidation.maxFromDate = this.customForm.value.toDate;
  }

  reset(): void {
    this.customForm.reset();
    this.isCustomApplied = false;
    this.initializeDates(this.duration);
    this.getDashboardData(this.duration);
  }
    permissionHandler() {
      let permission = this._commonService.getPermissionByModuleId(
        MODULE_ID_OF.DASHBOARD
      );
      if (!isObjEmpty(permission)) {
        if (!permission.edit) {
          this.isAddEditAccess = false
        }
      }
    }
}
