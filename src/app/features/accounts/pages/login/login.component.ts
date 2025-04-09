import { Component, ElementRef, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { LIMIT, REGEX } from "../../../../constants/validators";
import {
  checkSpaceAtStartEnd,
  removeAllSpaces,
} from "../../../../constants/helper";
import { PreventKeysDirective } from "../../../../directives/prevent-keys/prevent-keys.directive";
import { RouterModule } from "@angular/router";
import { AccountService } from "../../_services/account.service";
import { ToastService } from "../../../../components/toast-notification/toast.service";
import { StorageService } from "../../../../services/storage/storage.service";
import { NumberDirective } from "../../../../directives/number/number.directive";
import { AbsoluteRoutePipe } from "../../../../pipes/absolute-route/absolute-route.pipe";
import { ErrorMessagePipe } from "../../../../pipes/error-message/error-message.pipe";
import { ApiResponse, ILoginForm } from "../../../../constants/interface";
import { firstValueFrom } from "rxjs";
import { API_STATUS, NUMBER_CONST } from "../../../../constants/number";
import { STRING_CONST } from "src/app/constants/string";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { ButtonComponent } from "src/app/components/button/button.component";
import { SocketService } from "src/app/services/socket/socket.service";

const MODULES = [
  ReactiveFormsModule,
  MatInputModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatIconModule,
  MatButtonModule,
  NumberDirective,
  PreventKeysDirective,
  AbsoluteRoutePipe,
  RouterModule,
  ErrorMessagePipe,
  ButtonComponent,
  MatCheckboxModule,
];
@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent {
  limit = LIMIT;
  isPasswordHidden: boolean = true;
  stringConst = STRING_CONST;
  numberConst = NUMBER_CONST;
  customButtonConst = CUSTOM_BUTTON_CONST;
  actionInProgress: boolean = false;
  removeSpace = removeAllSpaces;
  @ViewChild(STRING_CONST.EMAIL) emailRef!: ElementRef;
  @ViewChild(STRING_CONST.PASSWORD) passRef!: ElementRef;
  loginForm: FormGroup<ILoginForm> = new FormGroup({
    email: new FormControl("", [
      Validators.required,
      Validators.pattern(REGEX.EMAIL),
      Validators.maxLength(LIMIT.MAX_EMAIL_LENGTH),
    ]),
    password: new FormControl("", [
      Validators.required,
      Validators.pattern(REGEX.PASSWORD),
    ]),
    deviceToken: new FormControl(
      this._storageService.deviceDetail(NUMBER_CONST.ONE)
    ),
    deviceId: new FormControl(
      this._storageService.deviceDetail(NUMBER_CONST.TWO)
    ),
  });
  rememberMe: FormControl;
  constructor(
    private readonly _storageService: StorageService,
    private readonly _accountService: AccountService,
    private readonly _toasterService: ToastService,
    private readonly _socketService:SocketService
  ) {
    this.rememberMe = new FormControl(false);
    if(localStorage.getItem('rememberedEmail')){
      this.autofillPassword();

    }
  }

  /*------ Form controls ------*/
  get frmCtrl(): any {
    return this.loginForm.controls;
  }

  /*------ Login form validation ------*/
  loginHandler = (): void => {
    if (this.loginForm.valid) {
      this.actionInProgress = true;
      this.confirmLogIn();
      if (this.rememberMe.value) {
        const email = btoa(this.loginForm.get("email").value.toString());
        const password = btoa(this.loginForm.get("password").value.toString());
        localStorage.setItem("rememberedEmail", email);
        localStorage.setItem("rememberedPassword", password);
      }
    } else if (this.loginForm.invalid) {
      this.frmCtrl[this.stringConst.EMAIL].invalid
        ? this.emailRef.nativeElement.focus()
        : this.passRef.nativeElement.focus();
    } else if (
      checkSpaceAtStartEnd(this.frmCtrl[this.stringConst.PASSWORD].value)
    ) {
      this.frmCtrl.password.setErrors({ space: true });
      this.passRef.nativeElement.focus();
    }
  };

  /*------ Login api call and response handling ------*/
  confirmLogIn = async (): Promise<void> => {
    try {
      const formValue = this.loginForm.value;
      const responseData: ApiResponse = await firstValueFrom(
        this._accountService.logIn(formValue)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._storageService.loginSuccessfully(responseData);
        this._socketService.connectToServer(this._storageService.token);
        this._toasterService.success(responseData.message);
      }
    } catch (error) {
      this.actionInProgress = false;
      if (
        error.statusCode === API_STATUS.FOUR_ZERO_ZERO &&
        error.type === "EMAIL_NOT_REGISTERED"
      ) {
        this.frmCtrl.email.setErrors({ emailNotRegisteredForLogin: true });
      } else if (
        error.statusCode === API_STATUS.FOUR_ZERO_THREE &&
        error.type === "INCORRECT_PASSWORD"
      ) {
        this.frmCtrl.password.setErrors({ invalidPassword: true });
      } else if (error.statusCode === API_STATUS.FOUR_ZERO_ZERO) {
        this.frmCtrl.password.setErrors({ incorrect: true });
      } else{
        this._toasterService.error(error.message);
      }
    }
  };
  autofillPassword() {
    const rememberMeEmail = atob(localStorage.getItem("rememberedEmail"));
    const rememberMePassword = atob(localStorage.getItem("rememberedPassword"));
    this.frmCtrl.email.setValue(rememberMeEmail);
    this.frmCtrl.password.setValue(rememberMePassword);
  }
}
