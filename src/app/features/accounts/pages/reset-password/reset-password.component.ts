import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { LIMIT, REGEX } from '../../../../constants/validators';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { removeAllSpaces } from '../../../../constants/helper';
import { ToastService } from '../../../../components/toast-notification/toast.service';
import { AccountService } from '../../_services/account.service';
import { ACCOUNT, LOGIN, RESET_PASSWORD_SUCCESSFULL } from '../../../../constants/routes';
import { PreventKeysDirective } from '../../../../directives/prevent-keys/prevent-keys.directive';
import { NumberDirective } from '../../../../directives/number/number.directive';
import { AbsoluteRoutePipe } from '../../../../pipes/absolute-route/absolute-route.pipe';
import { ErrorMessagePipe } from '../../../../pipes/error-message/error-message.pipe';
import { ApiResponse, IResetForm } from '../../../../constants/interface';
import { firstValueFrom } from 'rxjs';
import { API_STATUS } from '../../../../constants/number';
import { STRING_CONST } from '../../../../constants/string';
import { ONBOARDING_KEYS } from '../../../../constants/constant';
import { CUSTOM_BUTTON_CONST } from 'src/app/constants/actionbutton-constant';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { PASSWORD_ERROR_MESSAGES } from 'src/app/constants/messages';

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
  ButtonComponent
];

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
})
export class ResetPasswordComponent {
  isPasswordHinnen: boolean = true;
  isConfirmPasswordHidden: boolean = true;
  limit = LIMIT;
  stringConst = STRING_CONST;
  customButtonConst = CUSTOM_BUTTON_CONST;
  removeSpace = removeAllSpaces;
  passwordErrorMessages = PASSWORD_ERROR_MESSAGES;
  public isSubAdmin: boolean = false;

  @ViewChild('pass') pass!: ElementRef;
  @ViewChild('cPass') cPass!: ElementRef;

  resetForm: FormGroup<IResetForm> = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.pattern(REGEX.PASSWORD)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.pattern(REGEX.PASSWORD)])
  });
  actionInProgress: boolean;
  constructor(
    private _actRoute: ActivatedRoute,
    private readonly _accountService: AccountService,
    private readonly _toastService: ToastService,
    private readonly _router: Router
  ) {
    if (this._actRoute.snapshot.queryParams[ONBOARDING_KEYS.TOKEN]) {
      this.isSubAdmin = this._actRoute.snapshot.queryParams[ONBOARDING_KEYS.SUB_ADMIN];
    } else {
      this._router.navigate(['404']);
    }
  }

  /*----- From Controls ------*/
  get frmCtrl(): any {
    return this.resetForm.controls;
  }

  /*----- Reset form validation ------*/
  resetValidations = (): void  => {
    removeAllSpaces(this.resetForm.value, this.frmCtrl);
    if (!this.frmCtrl.password.valid) {
      this.pass.nativeElement.focus();
      return;
    } else if (!this.frmCtrl.confirmPassword.valid) {
      this.cPass.nativeElement.focus();
      return;
    } else if (this.frmCtrl.confirmPassword.value != this.frmCtrl.password.value) {
      this.cPass.nativeElement.focus();
      this.frmCtrl.confirmPassword.setErrors({ passwordNotMatch: true });
      return;
    } else if (this.resetForm.valid && this.frmCtrl.confirmPassword.value == this.frmCtrl.password.value) {
      this.resetPasswordApiHandler();
      return;
    }
  }

  /*------ Reset password api call and response handling -----*/
  resetPasswordApiHandler = async (): Promise<void> => {
    this.actionInProgress = true;
    try {
      const resetObj = {
        [ONBOARDING_KEYS.ENCRYPTED_TOKEN] :this._actRoute.snapshot.queryParams[ONBOARDING_KEYS.TOKEN],
        [ONBOARDING_KEYS.PASSWORD]: this.frmCtrl[this.stringConst.PASSWORD].value,
      };
      const responseData: ApiResponse = await firstValueFrom(this._accountService.resetPassword(resetObj));
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._toastService.success(responseData.message);
        this._router.navigate([LOGIN.fullUrl]);
        // this._router.navigate([ACCOUNT, RESET_PASSWORD_SUCCESSFULL]);
      }
    } catch(error) {
      this.actionInProgress = false;
      this._toastService.error(error.message);
    }
  }

  /*------ Confirm password set required ------*/
  onBlur() {
    if (this.frmCtrl.password.invalid) {
      this.frmCtrl.confirmPassword.setErrors({ required: true });
      this.frmCtrl.confirmPassword.updateValueAndValidity();
    }
  }
  
  /*------ Confirm password remove errors ------*/
  resetControlError() {
    this.frmCtrl.confirmPassword.setErrors(null);
    this.frmCtrl.confirmPassword.updateValueAndValidity();
  }
}
