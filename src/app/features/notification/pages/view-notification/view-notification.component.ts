import { USERS_API } from 'src/app/constants/api-end-point';
import { Component, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatMenuModule } from "@angular/material/menu";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { BC_NOTIFICATION_VIEW } from "src/app/constants/breadcrumb-routes";
import {
  NOTIFICATION_USER_TYPE,
  ONBOARDING_KEYS,
} from "src/app/constants/constant";
import { ApiResponse } from "src/app/constants/interface";
import { CommonService } from "src/app/services/common/common.service";
import { NotificationService } from "../../_services/notification.service";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { API_STATUS } from "src/app/constants/number";
import { CommonModule } from "@angular/common";
import { UserTypePipe } from "src/app/pipes/userType/user-type.pipe";

@Component({
  selector: "app-view-notification",
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatMenuModule,
    MatButtonModule,
    DataLoaderComponent,
    CommonModule,
    UserTypePipe,
  ],
  templateUrl: "./view-notification.component.html",
  styleUrl: "./view-notification.component.scss",
})
export class ViewNotificationComponent implements OnInit {
  public isLoaderShow: boolean = true;
  public notificationId: any;
  public notificationDetails: any;
  public userType = NOTIFICATION_USER_TYPE;
  public showUserIcon:boolean = false
  constructor(
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _commonService: CommonService,
    private readonly _actRoute: ActivatedRoute,
    private readonly _notificationService: NotificationService,
    private readonly _toasterService: ToastService
  ) {}
   ngOnInit(): void {
    this._breadcrumbService.setBreadcrumb(BC_NOTIFICATION_VIEW);
    this.notificationId = this._commonService.decryption(
      this._actRoute.snapshot.params[ONBOARDING_KEYS.NOTIFICATION_ID]
    );
   this.getNotificationDetails();
  }

  async getNotificationDetails() {
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._notificationService.getNotificationDetails({
          notificationId: this.notificationId,
        })
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.notificationDetails = responseData.data;
    //  this.notificationDetails?.USERS_API.includes(this.userType.MANUALLY_SELECTED) ? this.showUserIcon = true: false
        this.isLoaderShow = false;
      }
    } catch (error) {
      this._toasterService.error(error.message);
    }
  }
}
