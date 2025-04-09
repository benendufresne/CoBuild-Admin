import { Component, OnInit } from "@angular/core";
import { RequestManagementService } from "../../service/request-management.service";
import { ApiResponse } from "src/app/constants/interface";
import { firstValueFrom } from "rxjs";
import { API_STATUS } from "src/app/constants/number";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { BC_REQUEST_DETAILS } from "src/app/constants/breadcrumb-routes";
import { STRING_CONST } from "src/app/constants/string";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/services/common/common.service";
import { CommonModule } from "@angular/common";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatSelectModule } from "@angular/material/select";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { ErrorMessagePipe } from "src/app/pipes/error-message/error-message.pipe";
import { AddressFieldComponent } from "src/app/components/address-field/address-field.component";
import { DATE_TYPES, MODULE_ID_OF } from "src/app/constants/messages";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { NoLeadingSpaceDirective } from "src/app/directives/no-leading-space/no-leading-space.directive";
import { LIMIT, REGEX } from "src/app/constants/validators";
import { ButtonComponent } from "src/app/components/button/button.component";
import { REQUEST_MANAGEMENT, SUPPORT } from "src/app/constants/routes";
import {
  REQUEST_TYPE,
  SERVICE_TYPE,
  SERVICE_TYPE_ARRAY,
} from "src/app/constants/constant";
import { RejectConfirmationComponent } from "src/app/components/reject-confirmation/reject-confirmation.component";
import { MatDialog } from "@angular/material/dialog";
import { PhotosVideosCarasouelComponent } from "src/app/components/photos-videos-carasouel/photos-videos-carasouel.component";
import { generateMongoId, isObjEmpty } from "src/app/constants/helper";
import { ChatService } from "src/app/services/chat/chat.service";
import { StorageService } from "src/app/services/storage/storage.service";
import { reportChatId } from "src/app/constants/storage-keys";
const MODULES = [
  MatFormFieldModule,
  MatInputModule,
  FormsModule,
  ReactiveFormsModule,
  MatSelectModule,
  DataLoaderComponent,
  ErrorMessagePipe,
  AddressFieldComponent,
  NoLeadingSpaceDirective,
  ButtonComponent,
  PhotosVideosCarasouelComponent,
];
@Component({
  selector: "app-details",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./details.component.html",
  styleUrl: "./details.component.scss",
})
export class DetailsComponent implements OnInit {
  public isLoading: boolean = true;
  public requestLoading: boolean = true;
  private requestId;
  public dateType = DATE_TYPES;
  public customButtonConst = CUSTOM_BUTTON_CONST;
  public requestForm!: FormGroup;
  public requestDetails;
  public limit = LIMIT;
  public category;
  issueTypeNames: any[] = [];
  subIssueNames: any[] = [];
  public type = SERVICE_TYPE_ARRAY;
  public requestStatus = REQUEST_TYPE;
  public checkServiceType = SERVICE_TYPE;
  selectedIssueType;
  selectedSubIssue;
  public showImage: boolean = false;
  public isAddEditAccess: boolean = true;
  constructor(
    private readonly _requestService: RequestManagementService,
    private readonly _toastService: ToastService,
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _actRoute: ActivatedRoute,
    private readonly _commonService: CommonService,
    private readonly _storageService: StorageService,
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private readonly _dialog: MatDialog,
    private readonly _chatService: ChatService
  ) {}
  ngOnInit() {
    if (this._actRoute.snapshot.params[STRING_CONST.REQUEST_ID]) {
      this.requestId = this._commonService.decryption(
        this._actRoute.snapshot.params[STRING_CONST.REQUEST_ID]
      );
      this.getRequestDetails();
      this.createForm();
      this.permissionHandler();
    }
  }

  createForm() {
    this.requestForm = this._formBuilder.group({
      serviceType: [""],
      categoryObj: [""],
      issueTypeObj: [""],
      subIssueObj: [""],
      estimatedDays: [
        "",
        [Validators.required, Validators.pattern(REGEX.ONLY_NUMBER)],
      ],
      amount: ["", [Validators.required, Validators.pattern(REGEX.PRICE)]],
      address: ["", []],
      lat: ["", []],
      lng: ["", []],
      notes: [
        "",
        [Validators.required, Validators.minLength(LIMIT.MIN_NAME_LENGTH)],
      ],
    });
  }
  get frmCtrl() {
    return this.requestForm.controls;
  }
  permissionHandler() {
    let permission = this._commonService.getPermissionByModuleId(
      MODULE_ID_OF.REQUEST_MANAGEMENT
    );
    if (!isObjEmpty(permission)) {
      if (!permission.edit) {
        this.isAddEditAccess = false;
      }
    }
  }

  async getRequestDetails(): Promise<void> {
    try {
      const requestBody = {
        reqId: this.requestId,
      };
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._requestService.getRequestDetails(requestBody)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.requestDetails = responseData.data;
        this._breadcrumbService.setBreadcrumb(
          BC_REQUEST_DETAILS(this.requestDetails?.requestIdString)
        );
        this.loadCategoryAndRelatedData();
        if (this.requestDetails?.mediaType) {
          this.mapMedia();
          const mediaType = this.requestDetails.mediaType; // Store for debugging
          if (Array.isArray(mediaType) && mediaType.includes("image")) {
            this.showImage = true;
          } else if (
            typeof mediaType === "string" &&
            mediaType.includes("image")
          ) {
            this.showImage = true;
          }
        }
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }
  mapMedia(): void {
    const data = [
      {
        media: this.requestDetails.media,
        mediaType: this.requestDetails.mediaType,
      },
    ];
    this.requestDetails = {
      ...this.requestDetails,
      ...this._commonService.mapMedia(data),
    };
  }
  async loadCategoryAndRelatedData() {
    let selectedCategory;
    if (
      this.requestDetails?.serviceType !== this.checkServiceType.CUSTOM_SERVICE
    ) {
      await this.getCategory(this.requestDetails?.serviceType);
      selectedCategory = this.category.find(
        (item) => item.categoryName === this.requestDetails?.categoryName
      );
      if (
        this.requestDetails?.serviceType ===
        this.checkServiceType.CABLE_CONSULTING_SERVICE
      ) {
        this.issueTypeNames = selectedCategory.issueTypeNames || [];
        this.selectedIssueType = this.issueTypeNames.find(
          (item) => item.issueTypeName === this.requestDetails?.issueTypeName
        );
        if (this.selectedIssueType) {
          this.subIssueNames = this.selectedIssueType.subIssueNames || [];
          this.selectedSubIssue = this.subIssueNames.find(
            (item) => item === this.requestDetails?.subIssueName
          );
        }
      }
    }
    this.patchRequestForm(selectedCategory);
  }

  patchRequestForm(selectedCategory: any): void {
    this.requestForm.patchValue({
      ...this.requestDetails,
      categoryObj: selectedCategory,
      issueTypeObj: this.selectedIssueType,
      subIssueObj: this.selectedSubIssue,
      address: this.requestDetails?.location?.address,
      lat: this.requestDetails?.location?.coordinates?.[1],
      lng: this.requestDetails?.location?.coordinates?.[0],
    });

    if (this.requestDetails?.status !== this.requestStatus.BID_AGAIN && this.requestDetails?.status !== this.requestStatus.PENDING) {
      this.requestForm.disable();
    }
    this.requestLoading = false;
  }

  async getCategory(serviceType): Promise<void> {
    const data = {
      serviceType,
    };
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._requestService.getCategoryDropdownList(data)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.category = responseData?.data;
        this.isLoading = false;
      }
    } catch (error) {
      this._toastService.error(error.message);
      this.isLoading = false;
    }
  }
  onSelectionChange(event: any, controlName: string): void {
    switch (controlName) {
      case "serviceType":
        if (event.value) {
          this.frmCtrl["categoryObj"]?.setValidators([Validators.required]);
          this.frmCtrl["categoryObj"]?.updateValueAndValidity();
          this.getCategory(event.value);
        } else {
          this.category = [];
        }
        break;

      case "categoryObj":
        const selectedCategory = event.value;
        if (selectedCategory) {
          this.issueTypeNames = selectedCategory.issueTypeNames || [];
          this.subIssueNames = [];
          this.requestForm.patchValue({
            issueTypeObj: null,
            subIssueObj: null,
          });
        }
        break;

      case "issueTypeObj":
        const selectedIssueType = event.value;
        if (selectedIssueType) {
          this.subIssueNames = selectedIssueType.subIssueNames || [];
          this.requestForm.patchValue({
            subIssueObj: null,
          });
        }
        break;

      default:
        break;
    }
  }
  async onReject() {
    const dialog = this._dialog.open(RejectConfirmationComponent, {
      panelClass: "account-popup",
      width: "640px",
    });

    try {
      const result = await firstValueFrom(dialog.afterClosed());
      if (result) {
        const requestBody = {
          status: this.requestStatus.REJECTED,
          rejectReason: result?.value?.message,
          reqId: this.requestId,
        };

        const responseData: ApiResponse<any> = await firstValueFrom(
          this._requestService.editRequest(requestBody)
        );

        if (responseData.statusCode === API_STATUS.SUCCESS) {
          const newMessage = {
            chatId: this.requestDetails?.chatId,
          };
          this._chatService.rejectStatusEmitter(newMessage, (response) => {

              this._router.navigate([SUPPORT.fullUrl]);
              sessionStorage.setItem(
                reportChatId,
                btoa(this.requestDetails.chatId)
              );
            this._toastService.success(responseData.message);
            if (!response) {
              console.error("Failed to send message");
            }
          });
        }
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }

  navigateToLisitng() {
    this._router.navigate([REQUEST_MANAGEMENT.fullUrl]);
  }
  async onSubmit() {
    try {
      const {
        amount,
        categoryObj,
        lng,
        lat,
        address,
        issueTypeObj,
        subIssueObj,
        ...formValues
      } = this.requestForm.value;
      const requestBody = {
        ...formValues,
        amount: Number(amount),
        categoryName: categoryObj?.categoryName,
        categoryId: categoryObj?._id,
        categoryIdString: categoryObj?.categoryIdString,
        // status: this.requestStatus.APPROVED,
        location: {
          coordinates: [lng, lat],
          address,
        },
        issueTypeName: issueTypeObj?.issueTypeName || " ",
        subIssueName: subIssueObj || " ",
        ...(this.requestId && { reqId: this.requestId }),
      };

      delete requestBody.lat;
      delete requestBody.lng;
      delete requestBody.address;
      delete requestBody.categoryObj;
      delete requestBody.issueTypeObj;
      delete requestBody.subIssueObj;
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._requestService.editRequest(requestBody)
      );

      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._toastService.success(responseData.message);
        const newMessage = {
          chatId: this.requestDetails?.chatId,
          messageType: "QUOTATION",
          senderId: this._storageService?.profileDetail?.userId,
          localMessageId: generateMongoId(),
          message: "quotation",
          created: new Date().toISOString(),
          amount: this.frmCtrl["amount"].value,
          estimatedDays: this.frmCtrl["estimatedDays"].value,
          notes: this.frmCtrl["notes"].value,
        };
        
        this._chatService.sendMessageEmitter(newMessage, (response) => {
          this.navigateToLisitng();
          if (!response) {
            console.error("Failed to send message");
          }
        });
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }
}
