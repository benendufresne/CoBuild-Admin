import { CommonModule } from "@angular/common";
import {
  Component,
  ElementRef,
  NgZone,
  OnInit,
  ViewChild,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { ButtonComponent } from "src/app/components/button/button.component";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { ABS_USER_MANAGEMENT } from "src/app/constants/absolute-routes";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { BC_ADD_USER, BC_EDIT_USER, BC_USERS_DETAILS } from "src/app/constants/breadcrumb-routes";
import { ApiResponse, DialogData, IUserForm } from "src/app/constants/interface";
import { API_STATUS, NUMBER_CONST } from "src/app/constants/number";
import { STRING_CONST } from "src/app/constants/string";
import { LIMIT, REGEX } from "src/app/constants/validators";
import { NoLeadingSpaceDirective } from "src/app/directives/no-leading-space/no-leading-space.directive";
import { OnlyNumberDirective } from "src/app/directives/only-number/only-number.directive";
import { PreventKeysDirective } from "src/app/directives/prevent-keys/prevent-keys.directive";
import { ErrorMessagePipe } from "src/app/pipes/error-message/error-message.pipe";
import { CommonService } from "src/app/services/common/common.service";
import { GoogleService, Maps } from "src/app/services/google/google.service";
import { UserManagementService } from "../../service/user-management.service";
import { EDIT_USER } from "src/app/constants/routes";
import { ConfirmationModalComponent } from "src/app/components/confirmation-modal/confirmation-modal.component";
import { LISTING_COMMON_MESSAGES, MODULE_ID_OF } from "src/app/constants/messages";
import { USER_STATUS_ENUM } from "src/app/constants/constant";
import { MatDialog } from "@angular/material/dialog";
import { AddressFieldComponent } from "src/app/components/address-field/address-field.component";
import { isObjEmpty } from "src/app/constants/helper";

@Component({
  selector: "app-add-edit",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    ErrorMessagePipe,
    PreventKeysDirective,
    NoLeadingSpaceDirective,
    ButtonComponent,
    OnlyNumberDirective,
    DataLoaderComponent,
    AddressFieldComponent
  ],
  templateUrl: "./add-edit.component.html",
  styleUrl: "./add-edit.component.scss",
})
export class AddEditComponent{
  public userId: any;
  public isLoaderShow: boolean = true;
  public stringConst = STRING_CONST;
  public limit = LIMIT;
  public numberConst = NUMBER_CONST;
  public actionInProgress: boolean = false;
  public isAddEditAccess:boolean = true;
  public userStatus = USER_STATUS_ENUM;
  public userDetails;
  public userForm: FormGroup<IUserForm> = new FormGroup({
    name: new FormControl("", [
      Validators.required,
      Validators.maxLength(LIMIT.MAX_NAME_LENGTH),
      Validators.minLength(LIMIT.MIN_NAME_LENGTH),
      Validators.pattern(REGEX.NAME),
    ]),
    email: new FormControl("", [
      Validators.required,
      Validators.pattern(REGEX.EMAIL),
      Validators.maxLength(LIMIT.MAX_EMAIL_LENGTH)
    ]),
    countryCode: new FormControl("+1", [Validators.required]),
    mobileNo: new FormControl("", [
      Validators.required,
      Validators.pattern(REGEX.MOBILE_NUMBER),
      Validators.minLength(LIMIT.MIN_MOBILE_LENGTH),
    ]),
    address: new FormControl("", [Validators.required]),
    lat: new FormControl("",[Validators.required]),
    lng: new FormControl("",[Validators.required]),
  });
  public viewOnly: boolean = false;
  public customButtonConst = CUSTOM_BUTTON_CONST;
  constructor(
    private readonly _router: Router,
    private readonly _actRoute:ActivatedRoute,
    private readonly _commonService:CommonService,
    private readonly _breadcrumbService:BreadcrumbService,
    private readonly _toastService:ToastService,
    private readonly _userService:UserManagementService,
    private readonly _dialog:MatDialog
  ) {
    if (this._actRoute.snapshot.params[STRING_CONST.USER_ID]) {
      
      this.userId = this._commonService.decryption(this._actRoute.snapshot.params[STRING_CONST.USER_ID]);
      this.viewOnly = Boolean(this._actRoute.snapshot.data[STRING_CONST.VIEW_ONLY]);
      this.viewOnly ? this._breadcrumbService.setBreadcrumb(BC_USERS_DETAILS) : this._breadcrumbService.setBreadcrumb(BC_EDIT_USER);
      this.frmCtrl[STRING_CONST.EMAIL].disable();
      this.getUserDetails();
    } else {
      this._breadcrumbService.setBreadcrumb(BC_ADD_USER);
    }
    this.permissionHandler();
  }
  /*------ Form controls ------*/
  get frmCtrl(): any {
    return this.userForm.controls;
  }
  async getUserDetails(): Promise<void> {
    try {
      const requestBody = {
        userId: this.userId
      }
      const responseData: ApiResponse<any> = await firstValueFrom(this._userService.getUserDetail(requestBody));
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.userDetails = responseData.data
        this.userForm.patchValue({
          ...this.userDetails,
          address:this.userDetails?.location?.address,
        });
        if(this.userDetails?.location?.coordinates){
          this.userForm.patchValue({
            lat:this.userDetails?.location?.coordinates[1],
            lng:this.userDetails?.location?.coordinates[0],
          });
        }
        if (this.viewOnly) this.userForm.disable();
        this.isLoaderShow = false;
      }
    } catch (error) {
      this.actionInProgress = false;
      this._toastService.error(error.message);
    }
  }
    permissionHandler() {
      let permission = this._commonService.getPermissionByModuleId(
        MODULE_ID_OF.USER_MANAGEMENT
      );
      if (!isObjEmpty(permission)) {
        if (!permission.edit) {
          this.isAddEditAccess = false;
        }
      }
    }
  getTitleAndMessage(data: any): DialogData {
 if (data === USER_STATUS_ENUM.BLOCKED) {
      return {
        title: LISTING_COMMON_MESSAGES.ACTIVE_TITLE,
        message: `${LISTING_COMMON_MESSAGES.ACTIVE_MSG} this customer?`,
        btn1: `${LISTING_COMMON_MESSAGES.ACTIVE_TITLE}`,
      };
    } else {
      return {
        title: LISTING_COMMON_MESSAGES.BLOCK_TITLE,
        message: `${LISTING_COMMON_MESSAGES.BLOCK_MSG} this customer?`,
        btn1: `${LISTING_COMMON_MESSAGES.BLOCK_TITLE}`,
      };
    }
  }
  confirmationDialog(data: any) {
    const { title, message, btn1 } = this.getTitleAndMessage(data);
    const dialog = this._dialog.open(ConfirmationModalComponent, {
      data: {
        title,
        message,
        btn1,
      },
    });

    dialog.afterClosed().subscribe((result) => {
      if (result) {
          this.updateStatus();
      }
    });
  }
  async updateStatus() {
    const data = {
      userId: this.userDetails.userId,
      type: this.userDetails.status === USER_STATUS_ENUM.BLOCKED ? USER_STATUS_ENUM.UN_BLOCKED : USER_STATUS_ENUM.BLOCKED,
    };
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._userService.updateUserStatus(data)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._toastService.success(responseData.message);
        this.getUserDetails();
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }
  onCancel() {
    this._router.navigate([ABS_USER_MANAGEMENT]);
  }
  navigateToEdit(){
    const id =this._commonService.encryption(this.userId)
    this._router.navigate([`${EDIT_USER.fullUrl}/ ${id}`]);

  }
  async onSubmit(): Promise<void> {
    this.actionInProgress = true;
    try {
      const requestBody = { ...this.userForm.value };
      requestBody['location']={
        coordinates:[this.userForm.controls["lng"].value,this.userForm.controls["lat"].value],
        address:this.userForm.controls["address"].value
      }
      if(this.userId){
        requestBody['email']=this.userDetails?.email
      }
      delete requestBody['lat'];
      delete requestBody['lng'];
      delete requestBody['address']

      if (this.userId) {
        requestBody[STRING_CONST.USER_ID] = this.userId;
      }
      
      const responseData: ApiResponse<any> = this.userId ? await firstValueFrom(this._userService.editUser(requestBody)) : await firstValueFrom(this._userService.addUser(requestBody));
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._toastService.success(responseData.message);
        this.onCancel();
      }
    } catch (error) {
      this.actionInProgress = false;
      this._toastService.error(error.message);
    }
  }

}
