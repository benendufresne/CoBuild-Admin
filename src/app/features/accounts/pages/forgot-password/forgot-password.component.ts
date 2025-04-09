import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LIMIT, REGEX } from '../../../../constants/validators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { isObjEmpty, removeAllSpaces } from '../../../../constants/helper';
import { CommonService } from '../../../../services/common/common.service';
import { PreventKeysDirective } from '../../../../directives/prevent-keys/prevent-keys.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../_services/account.service';
import { AbsoluteRoutePipe } from '../../../../pipes/absolute-route/absolute-route.pipe';
import { NumberDirective } from '../../../../directives/number/number.directive';
import { ErrorMessagePipe } from '../../../../pipes/error-message/error-message.pipe';
import { ApiResponse, IForgotForm } from '../../../../constants/interface';
import { Subscription, firstValueFrom, tap, timer } from 'rxjs';
import { API_STATUS } from '../../../../constants/number';
import { STRING_CONST } from '../../../../constants/string';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { CUSTOM_BUTTON_CONST } from 'src/app/constants/actionbutton-constant';
import { ToastService } from 'src/app/components/toast-notification/toast.service';
import { FORGOT_PASSWORD_SUCCESSFULL, LOGIN } from 'src/app/constants/routes';

const MODULES = [
  AbsoluteRoutePipe,
  ReactiveFormsModule,
  MatInputModule,
  MatFormFieldModule,
  MatIconModule,
  MatButtonModule,
  NumberDirective,
  PreventKeysDirective,
  RouterModule,
  ErrorMessagePipe,
  ButtonComponent,
];

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent {
  limit = LIMIT;
  forgotForm : FormGroup<IForgotForm> =  new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern(REGEX.EMAIL), Validators.maxLength(LIMIT.MAX_EMAIL_LENGTH)
    ])
  });
  @ViewChild(STRING_CONST.EMAIL)emailRef!: ElementRef;
  stringConst = STRING_CONST;
  customButtonConst = CUSTOM_BUTTON_CONST;
  actionInProgress: boolean;
  removeSpace = removeAllSpaces;
  public isSubmitButtonEnabled: boolean = true;
  public delayTime: number = 0;
  private subscriptions: Subscription = new Subscription();
  constructor(
    private readonly _commonService: CommonService,
    private readonly _accountService: AccountService,
    private readonly _toastService: ToastService,
    private readonly _router: Router
  ) { 
    this.checkForgotStoredInfo();
  }

  /*------ Form controls ------*/
  get frmCtrl(): any {
    return this.forgotForm.controls;
  }

  /*------Patch email address ------*/
  checkForgotStoredInfo = (): void => {
    if (this._commonService.forForgotInfo && !isObjEmpty(this._commonService.forForgotInfo)) {
      this.forgotForm.patchValue(this._commonService.forForgotInfo);
    }
  }

  /*------ Forgot form validation ------*/
  forgotValidation = (): void => {
    (this.forgotForm.valid) ? this.confirmForgot() : this.emailRef.nativeElement.focus();
  }

  /*------ Forgot password api call and response handling ------*/
  confirmForgot = async (): Promise<void> => {
    this.actionInProgress = true;
    try {
      const formValue = this.forgotForm.value;
      const responseData: ApiResponse = await firstValueFrom(this._accountService.forgotPassword(formValue));
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.actionInProgress = false;
        this.setDelayOnSubmit();
         this._router.navigate([FORGOT_PASSWORD_SUCCESSFULL.fullUrl]);
        this._toastService.success(responseData.message);
      }
    } catch (error) {
      this.actionInProgress = false;
      if (error.statusCode === API_STATUS.FOUR_ZERO_ZERO) {
        this._toastService.error(error.message);
        // this.frmCtrl.email.setErrors({emailNotRegisteredForLogin: true});
      }else if(error.statusCode === API_STATUS.FOUR_ZERO_THREE) {
        this.setDelayOnSubmit(error.data * 1000);
      }else if(error.statusCode === API_STATUS.FOUR_ZERO_FIVE) {
        this._toastService.error(error.message);
        this._router.navigate([LOGIN.fullUrl]);
      }
    }
  }
  setDelayOnSubmit(time?: number) {
    this.isSubmitButtonEnabled = false;
    this.delayTime = time || 60000;
    const myInterval = setInterval(() => { this.delayTime = this.delayTime - 1000 }, 1000);
    this.subscriptions.add(
      timer(this.delayTime).pipe(tap(() => { 
        this.isSubmitButtonEnabled = true;
        this.delayTime = 0;
        clearInterval(myInterval);
      })).subscribe()
    );
  }
}
