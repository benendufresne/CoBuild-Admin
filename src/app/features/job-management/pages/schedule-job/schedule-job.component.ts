import { CommonModule } from "@angular/common";
import { Component, ElementRef, Inject, OnInit, ViewChild, viewChild } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { provideMomentDateAdapter } from "@angular/material-moment-adapter";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MatNativeDateModule,
} from "@angular/material/core";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatTimepickerModule } from "ngx-mat-timepicker";
import { firstValueFrom } from "rxjs";
import { ButtonComponent } from "src/app/components/button/button.component";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { ApiResponse } from "src/app/constants/interface";
import { ErrorMessagePipe } from "src/app/pipes/error-message/error-message.pipe";
import { CommonService } from "src/app/services/common/common.service";
import { JobManagementService } from "../../service/job-management.service";
import { API_STATUS } from "src/app/constants/number";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import * as moment from "moment";
import { convertToTimestamp } from "src/app/constants/helper";
const MODULES = [
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  FormsModule,
  ButtonComponent,
  ReactiveFormsModule,
  ErrorMessagePipe,
  MatIconModule,
  MatSelectModule,
  MatDatepickerModule,
  MatNativeDateModule,
  NgxMatTimepickerModule,
];
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
  selector: "app-schedule-job",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./schedule-job.component.html",
  styleUrl: "./schedule-job.component.scss",
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: "en" },
  ],
})
export class ScheduleJobComponent implements OnInit {
  public currentDate: Date;
  public currentTime: any;
  public scheduleJobForm: FormGroup<any>;
  public customButtonConst = CUSTOM_BUTTON_CONST;
  public jobs;
  filteredJobs;
@ViewChild('jobSearch') jobSearch!:ElementRef<HTMLInputElement>;
  constructor(
    private readonly _fb: FormBuilder,
    private readonly _jobService: JobManagementService,
    private readonly _commonService: CommonService,
    private readonly _toastService: ToastService,
    private dialogRef: MatDialogRef<ScheduleJobComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentDate = new Date();
    this.dialogRef._containerInstance._config.width = "480px";
    this.dialogRef._containerInstance._config.autoFocus = false;
  }
  async ngOnInit(): Promise<void> {
    this.createForm();
    this.scheduleFormControl?.["scheduleDate"]?.valueChanges.subscribe(() => {
      this.updateMinTime();
    });
    await this.getJobId();
  }
  createForm() {
    this.scheduleJobForm = this._fb.group({
      scheduleDate: ["", [Validators.required]],
      scheduleTime: ["", [Validators.required]],
      jobId: ["", [Validators.required]],
    });
  }
  get scheduleFormControl() {
    return this.scheduleJobForm.controls;
  }
  updateMinTime(): void {
    const startDate = this.scheduleFormControl["scheduleDate"]?.value;
    if (new Date(startDate).toDateString() === new Date().toDateString()) {
      this.currentTime = this._commonService.getCurrentTime();
      if (
        this.scheduleFormControl["scheduleTime"]?.value &&
        this.currentTime > this.scheduleFormControl["scheduleTime"]?.value
      ) {
        this.scheduleFormControl["scheduleTime"]?.setValue(this.currentTime);
        this.scheduleFormControl["scheduleTime"].setValidators(
          Validators.required
        );
        this.scheduleFormControl["scheduleTime"].markAsDirty();
      }
    } else {
      this.currentTime = "00:00";
    }
  }
  filterJobs(): void {
    const searchValue =
       this.jobSearch.nativeElement.value
    this.filteredJobs = this.jobs.filter((job) =>
        (job?.title + ' ' + job?.jobIdString)
            .toLowerCase()
            .includes(searchValue?.toLowerCase())
    );
}
  onNoClick(value=false): void {
    this.dialogRef.close(value);
  }
  async getJobId(): Promise<void> {
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._jobService.getJobDropdownList()
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.jobs = responseData?.data;
        this.filteredJobs = this.jobs
      }
    } catch (error) {
      this.filteredJobs = []
      this._toastService.error(error.message);
      this.onNoClick();
    }
  }

clearSearch(): void {
  this.jobSearch.nativeElement.value = '';
  this.filteredJobs =[...this.jobs]; 
}
  async onSubmit() {
    let data = {
      scheduleDate: moment(
        this.scheduleFormControl["scheduleDate"]?.value
      ).format("DD/MM/YYYY"),
      schedule: convertToTimestamp(
        this.scheduleFormControl["scheduleDate"]?.value,
        this.scheduleFormControl["scheduleTime"]?.value
      ),
    };
    try {
      const requestData = {
        jobId: this.scheduleFormControl["jobId"]?.value,
        schedule: data.schedule,
      };
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._jobService.scheduleJob(requestData)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._toastService.success(responseData.message);
        this.onNoClick(true);
      }
    } catch (error) {
      this._toastService.error(error.message);
      this.onNoClick();

    }
  }
}
