import { Component, OnInit } from "@angular/core";
import { ApiResponse } from "src/app/constants/interface";
import { firstValueFrom } from "rxjs";
import { API_STATUS } from "src/app/constants/number";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { BC_INCIDENT_DAMAGE_DETAILS } from "src/app/constants/breadcrumb-routes";
import { STRING_CONST } from "src/app/constants/string";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/services/common/common.service";
import { CommonModule } from "@angular/common";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { DATE_TYPES, MODULE_ID_OF } from "src/app/constants/messages";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { ButtonComponent } from "src/app/components/button/button.component";
import { INCIDENTS_DAMAGE, SUPPORT } from "src/app/constants/routes";
import { DamageService } from "../../_service/damage.service";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { REPORT_DAMAGE_STATUS_TYPE } from "src/app/constants/constant";
import { MatDialog } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/components/confirmation-modal/confirmation-modal.component";
import { PhotosVideosCarasouelComponent } from "src/app/components/photos-videos-carasouel/photos-videos-carasouel.component";
import { FormControl, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { isObjEmpty } from "src/app/constants/helper";
import { ChatService } from "src/app/services/chat/chat.service";
import { reportChatId } from "src/app/constants/storage-keys";
const MODULES = [
  DataLoaderComponent,
  ButtonComponent,
  MatSelectModule,
  MatInputModule,
  PhotosVideosCarasouelComponent,
  FormsModule,
  ReactiveFormsModule,
];
@Component({
  selector: "app-damage-details",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./damage-details.component.html",
  styleUrl: "./damage-details.component.scss",
})
export class DamageDetailsComponent implements OnInit {
  public isLoading: boolean = true;
  private reportId;
  public dateType = DATE_TYPES;
  public customButtonConst = CUSTOM_BUTTON_CONST;
  public reportDetails;
  public damageStatus = REPORT_DAMAGE_STATUS_TYPE;
  isAddEditAccess: boolean = true;
  selectedStatusControl = new FormControl();
  constructor(
    private readonly _damageService: DamageService,
    private readonly _toastService: ToastService,
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _actRoute: ActivatedRoute,
    private readonly _commonService: CommonService,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _chatService:ChatService
  ) {}
  async ngOnInit(): Promise<void> {
    if (this._actRoute.snapshot.params[STRING_CONST.DAMAGE_ID]) {
      this.reportId = this._commonService.decryption(
        this._actRoute.snapshot.params[STRING_CONST.DAMAGE_ID]
      );
      this.getReportDetails();
      this._breadcrumbService.setBreadcrumb(
        BC_INCIDENT_DAMAGE_DETAILS("Details")
      );
    }
    this.permissionHandler();
  }

  async getReportDetails(): Promise<void> {
    try {
      const requestBody = {
        reportId: this.reportId,
      };
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._damageService.getDamagesDetails(requestBody)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.reportDetails = responseData.data;
        this.selectedStatusControl.setValue(this.reportDetails.status, {
          emitEvent: false,
        });
        this.mapMedia();
        this.isLoading = false;
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }
  permissionHandler() {
    let permission = this._commonService.getPermissionByModuleId(
      MODULE_ID_OF.REPORT_DAMAGE_MANAGEMENT
    );
    if (!isObjEmpty(permission)) {
      if (!permission.edit) {
        this.isAddEditAccess = false;
      }
    }
  }
  navigateToLisitng() {
    this._router.navigate([INCIDENTS_DAMAGE.fullUrl]);
  }
  async onSelectionChange(event: MatSelectChange) {
    const previousStatus = this.reportDetails.status;
    const newStatus = event.value;
    if (previousStatus === "COMPLETED" && newStatus === "PENDING") {
      this._toastService.error(
        `You cannot change the current status back to a previous status.`
      );
      this.selectedStatusControl.setValue(previousStatus, { emitEvent: false });
      return;
    }
    const dialog = this._dialog.open(ConfirmationModalComponent, {
      panelClass: "account-popup",
      width: "480px",
      data: {
        title: "Incidents/Damage Status",
        message: "Are you sure you want to complete this Incidents/Damage?",
      },
    });

    dialog.afterClosed().subscribe(async (res: boolean) => {
      if (res) {
        const data = {
          reportId: this.reportId,
          status: newStatus,
        };

        try {
          const responseData: ApiResponse<any> = await firstValueFrom(
            this._damageService.editDamagesStatus(data)
          );

          if (responseData.statusCode === API_STATUS.SUCCESS) {
            this.selectedStatusControl.setValue(newStatus, {
              emitEvent: false,
            });
            this._toastService.success(responseData.message);
            this.navigateToLisitng();
          }
        } catch (error) {
          this._toastService.error(error.message);
          this.selectedStatusControl.setValue(previousStatus, {
            emitEvent: false,
          });
        }
      } else {
        this.selectedStatusControl.setValue(previousStatus, {
          emitEvent: false,
        });
      }
    });
  }
  mapMedia(): void {
    this.reportDetails = {
      ...this.reportDetails,
      ...this._commonService.mapMedia(this.reportDetails.media),
    };
  }
  async navigateToChat() {
    await this._router.navigate([SUPPORT.fullUrl]);
    if (this.reportDetails.chatId) {
      sessionStorage.setItem(reportChatId,btoa(this.reportDetails.chatId))
    }
  }
}
