import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { BC_JOB_VIEW } from "src/app/constants/breadcrumb-routes";
import { ApiResponse } from "src/app/constants/interface";
import { STRING_CONST } from "src/app/constants/string";
import { CommonService } from "src/app/services/common/common.service";
import { JobManagementService } from "../../service/job-management.service";
import { API_STATUS } from "src/app/constants/number";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { LazyImageComponent } from "src/app/components/lazy-image/lazy-image.component";
import { FormatStatusPipe } from "src/app/pipes/format-status/format-status.pipe";
import { DATE_TYPES, MODULE_ID_OF } from "src/app/constants/messages";
import { EmptyValuePipe } from "src/app/pipes/empty-value/empty-value.pipe";
import { isObjEmpty } from "src/app/constants/helper";

@Component({
  selector: "app-view-job",
  standalone: true,
  imports: [CommonModule, DataLoaderComponent, LazyImageComponent,FormatStatusPipe,EmptyValuePipe],
  templateUrl: "./view-job.component.html",
  styleUrl: "./view-job.component.scss",
})
export class ViewJobComponent implements OnInit {
  public jobId;
  public dataLoading: boolean = true;
  public jobDetails;
  public dateType = DATE_TYPES;
  public isAddEditAccess:boolean =true;
  constructor(
    private _breadcrumbService: BreadcrumbService,
    private readonly _actRoute: ActivatedRoute,
    private readonly _commonService: CommonService,
    private readonly _jobService: JobManagementService,
    private readonly _toastService: ToastService
  ) {}
  ngOnInit(): void {
    if (this._actRoute.snapshot.params[STRING_CONST.JOB_ID]) {
      this.jobId = this._commonService.decryption(
        this._actRoute.snapshot.params[STRING_CONST.JOB_ID]
      );
      this._breadcrumbService.setBreadcrumb(BC_JOB_VIEW);
      this.getJobDetails();
      this.permissionHandler();
    }
  }
    permissionHandler() {
      let permission = this._commonService.getPermissionByModuleId(
        MODULE_ID_OF.JOB_MANAGEMENT
      );
      if (!isObjEmpty(permission)) {
        if (!permission.edit) {
          this.isAddEditAccess = false;
        }
      }
    }
  async getJobDetails(): Promise<void> {
    try {
      const requestBody = {
        jobId: this.jobId,
      };
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._jobService.detailsJob(requestBody)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.jobDetails = responseData.data;
        this.dataLoading = false;
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }
}
