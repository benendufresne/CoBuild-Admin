import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { ToastService } from 'src/app/components/toast-notification/toast.service';
import { checkSpaceAtStartEnd } from 'src/app/constants/helper';
import { PASSWORD_ERROR_MESSAGES } from 'src/app/constants/messages';
import { LIMIT, REGEX } from 'src/app/constants/validators';
import { ErrorMessagePipe } from 'src/app/pipes/error-message/error-message.pipe';
import { CommonService } from 'src/app/services/common/common.service';
import { ProfileService } from '../../service/profile.service';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { CUSTOM_BUTTON_CONST } from 'src/app/constants/actionbutton-constant';
import { ABS_DASHBOARD, ABS_PROFILE } from 'src/app/constants/absolute-routes';
import { BC_CHANGE_PASSWORD } from 'src/app/constants/breadcrumb-routes';


@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule,MatFormFieldModule,MatInputModule,FormsModule,ReactiveFormsModule,ErrorMessagePipe,ButtonComponent],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  hide = true; hide1 = true; hide2 = true;
  changePasswordForm: FormGroup;
  limit = LIMIT;
  errorMsg = PASSWORD_ERROR_MESSAGES;
public customButtonConst = CUSTOM_BUTTON_CONST
  @ViewChild('oPass') oPass: ElementRef;
  @ViewChild('pass') pass: ElementRef;
  @ViewChild('cPass') cPass: ElementRef;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _profile: ProfileService,
    private _toast: ToastService,
    private _common: CommonService,
    private _bc: BreadcrumbService
  ) {
  }

  ngOnInit() {
    this._common.scrollTop();
    this._bc.setBreadcrumb(BC_CHANGE_PASSWORD);
    this.createForm();
  }

  createForm() {
    this.changePasswordForm = this._fb.group({
      oldPassword: ['', [Validators.pattern(REGEX.PASSWORD)]],
      password: ['', [Validators.pattern(REGEX.PASSWORD)]],
      confirmPassword: ['', [Validators.pattern(REGEX.PASSWORD)]],
    });
  }

  get frmCtrl() { return this.changePasswordForm.controls; }

  submitHandler() {
    this.changePasswordValidations();
    if (this.changePasswordForm.valid) {
      this.changePasswordConfirm();
    }
  }

  changePasswordConfirm() {
    delete this.changePasswordForm.value.confirmPassword;
    const payload = {
      oldPassword: this.changePasswordForm.value.oldPassword,
      password: this.changePasswordForm.value.password
    }    
    this._profile.changePassword(payload).subscribe(res => {      
      this.changePasswordForm.disable();
      this._toast.success(res.message);
      this.navigateToDashboard();
    }, (error) => {
      if (error.statusCode == 400) {
        this.frmCtrl['oldPassword'].setErrors({ 'incorrect': true });
        this.oPass.nativeElement.focus();
        this.hide = false;
      }
    })
  }

  changePasswordValidations() {
    if (!this.frmCtrl['oldPassword'].valid) {
      this.oPass.nativeElement.focus();
      return
    }
    /*------Check Space In Old Pass---*/
    if (checkSpaceAtStartEnd(this.frmCtrl['oldPassword'].value)) {
      this.frmCtrl['oldPassword'].setErrors({ space: true });
      this.oPass.nativeElement.focus();
      return;
    }

    if (! this.frmCtrl['password'].valid) {
      this.pass.nativeElement.focus();
      return
    }
    /*------Check Space In New Pass---*/
    if (checkSpaceAtStartEnd(this.frmCtrl['password'].value)) {
      this.frmCtrl['password'].setErrors({ space: true });
      this.pass.nativeElement.focus();
      return;
    }

    if (!this.frmCtrl['confirmPassword'].valid) {
      this.cPass.nativeElement.focus()
      return
    }
    /*------Check Space In Confirm Pass---*/
    if (checkSpaceAtStartEnd(this.frmCtrl['confirmPassword'].value)) {
      this.frmCtrl['confirmPassword'].setErrors({ space: true });
      this.cPass.nativeElement.focus();
      return;
    }

    /*------Match/Not-Match Pass---*/
    if (this.frmCtrl['oldPassword'].value ==  this.frmCtrl['password'].value) {
       this.frmCtrl['password'].setErrors({ 'match': true });
      // this.pass.nativeElement.focus();
      this.hide = false;
      this.hide1 = false;
      return
    }
    if (this.frmCtrl['confirmPassword'].value !=  this.frmCtrl['password'].value) {
      this.frmCtrl['confirmPassword'].setErrors({ 'passwordNotMatch': true });
      // this.cPass.nativeElement.focus();
      this.hide1 = false;
      this.hide2 = false;
      return
    }
  }

  onBlur(isForCp = true) {
    if (isForCp &&  this.frmCtrl['password'].invalid) {
      this.frmCtrl['confirmPassword'].setErrors({ required: true });
      this.frmCtrl['confirmPassword'].updateValueAndValidity();
    } else if (this.frmCtrl['oldPassword'].invalid) {
       this.frmCtrl['password'].setErrors({ required: true });
       this.frmCtrl['password'].updateValueAndValidity();
    }
  }

  resetControlError(isForCp = true) {
    if (isForCp) {
      this.frmCtrl['confirmPassword'].setErrors(null);
      this.frmCtrl['confirmPassword'].updateValueAndValidity();
    } else {
      this.frmCtrl['password'].setErrors(null);
      this.frmCtrl['password'].updateValueAndValidity();
    }
  }

  navigateToDashboard() {
    this._router.navigate([ABS_PROFILE]);
  }

}

