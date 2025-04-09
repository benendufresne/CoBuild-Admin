import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LazyImageComponent } from "src/app/components/lazy-image/lazy-image.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { EmptyValuePipe } from "src/app/pipes/empty-value/empty-value.pipe";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { LIMIT, REGEX } from "src/app/constants/validators";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { checkSpaceAtStartEnd } from "src/app/constants/helper";
import { CommonService } from "src/app/services/common/common.service";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { PreventKeysDirective } from "src/app/directives/prevent-keys/prevent-keys.directive";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ProfileService } from "../../service/profile.service";
import { UploadImgComponent } from "src/app/components/upload-img/upload-img.component";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { BC_PROFILE, BC_SUB_ADMIN_PROFILE } from "src/app/constants/breadcrumb-routes";
import { StorageService } from "src/app/services/storage/storage.service";
import { NumberDirective } from "src/app/directives/number/number.directive";
import { DATE_TYPES, PASSWORD_ERROR_MESSAGES } from "src/app/constants/messages";
import { UploadImageComponent } from "../upload-image/upload-image.component";
import { ABS_ACCOUNT_LOGIN, ABS_PROFILE_EDIT, ABS_USER_MANAGEMENT } from "src/app/constants/absolute-routes";
import { ADMIN_TYPES } from "src/app/constants/roles";
import { UserTypePipe } from "src/app/pipes/userType/user-type.pipe";
@Component({
  selector: "app-basic-details",
  standalone: true,
  imports: [
    CommonModule,
    LazyImageComponent,
    MatTooltipModule,
    EmptyValuePipe,
    MatInputModule,
    MatFormFieldModule,
    MatCheckboxModule,
    MatIconModule,
    MatButtonModule,
    NumberDirective,
    PreventKeysDirective,
    ReactiveFormsModule,
    MatDialogModule,
    UploadImgComponent,
    UserTypePipe
  ],
  templateUrl: "./basic-details.component.html",
  styleUrls: ["./basic-details.component.scss"],
})
export class BasicDetailsComponent implements OnInit {
  ChangePassword: FormGroup = new FormGroup({});
  dateTypes = DATE_TYPES;
  errorMsg = PASSWORD_ERROR_MESSAGES;
  hide1 = true;
  hide2 = true;
  hide3 = true;
  limit = LIMIT;
  passwordInstruction:string=`Please enter between 7-16 character password with at least 1 upper case, 1 lower case, 1 number & 1 special character from @,%,&,*`
  dateType = DATE_TYPES
  selectedFile: any = [];
  @ViewChild("pass")
  pass!: ElementRef;
  @ViewChild("cPass")
  cPass!: ElementRef;
  @ViewChild("Oldpass")
  Oldpass!: ElementRef;
  adminTypes = ADMIN_TYPES;
  constructor(
    public storage: StorageService,
    private _fb: FormBuilder,
    private _actRoute: ActivatedRoute,
    private _profile: ProfileService,
    private _toast: ToastService,
    private _dialog: MatDialog,
    private _route: Router,
    private _breadcrumbService: BreadcrumbService
  ) {}

  ngOnInit() {
    this.storage.profileDetail.userType === ADMIN_TYPES.ADMIN ? this._breadcrumbService.setBreadcrumb(BC_PROFILE) : this._breadcrumbService.setBreadcrumb(BC_SUB_ADMIN_PROFILE);
    this.createForm();
  }
  createForm() {
    this.ChangePassword = this._fb.group({
      currentPassword: ["", Validators.pattern(REGEX.PASSWORD)],
      password: ["", Validators.pattern(REGEX.PASSWORD)],
      confirmPassword: ["", Validators.pattern(REGEX.PASSWORD)],
    });
  }
  get frmCtrl(): any {
    return this.ChangePassword.controls;
  }

  submitHandler() {
    this.resetValidations();
    if (this.ChangePassword.valid) {
      const resetObj = {
        token: this._actRoute.snapshot.params["token"],
        oldPassword: this.frmCtrl.currentPassword.value,
        password: this.frmCtrl.password.value,
      };
      this._profile.changePassword(resetObj).subscribe((response: any) => {
        if (response.statusCode === 200) {
          this.ChangePassword.disable();
          this._toast.success("Password changed succesfully");
          this._route.navigate([ABS_ACCOUNT_LOGIN]);
        }
      });
    }
  }

  resetValidations() {
    if (!this.frmCtrl.password.valid) {
      this.pass.nativeElement.focus();
      return;
    }

    if (!this.frmCtrl.currentPassword.valid) {
      this.Oldpass.nativeElement.focus();
      return;
    }
    /*------Check space---*/
    if (checkSpaceAtStartEnd(this.frmCtrl.currentPassword.value)) {
      this.frmCtrl.currentPassword.setErrors({ space: true });
      this.Oldpass.nativeElement.focus();
      return;
    }
    if (checkSpaceAtStartEnd(this.frmCtrl.password.value)) {
      this.frmCtrl.password.setErrors({ space: true });
      this.pass.nativeElement.focus();
      return;
    }
    if (!this.frmCtrl.confirmPassword.valid) {
      this.cPass.nativeElement.focus();
      return;
    }
    /*------Check space---*/
    if (checkSpaceAtStartEnd(this.frmCtrl.confirmPassword.value)) {
      this.frmCtrl.confirmPassword.setErrors({ space: true });
      this.cPass.nativeElement.focus();
      return;
    }
    
    /*------Match/Not-Match Pass---*/
    if (this.frmCtrl.currentPassword.value == this.frmCtrl.password.value) {
      this.frmCtrl.password.setErrors({ match: true });
      return;
    }
    if (this.frmCtrl.confirmPassword.value != this.frmCtrl.password.value) {
      this.cPass.nativeElement.focus();
      this.frmCtrl.confirmPassword.setErrors({ notMatch: true });
      return;
    }
  }

  onBlur() {
    if (this.frmCtrl.password.invalid) {
      this.frmCtrl.confirmPassword.setErrors({ required: true });
      this.frmCtrl.confirmPassword.updateValueAndValidity();
    }
  }

  resetControlError() {
    this.frmCtrl.confirmPassword.setErrors(null);
    this.frmCtrl.confirmPassword.updateValueAndValidity();
  }
  updateAdminDetails() {
    this._route.navigateByUrl(ABS_PROFILE_EDIT);
  }

  imageUpload(selectedFile) {
    const dialog = this._dialog.open(UploadImageComponent, {
      panelClass: "account-popup",
      data: selectedFile,
      width: "400px",
    });
    dialog.afterClosed().subscribe((res) => {
    });
  }
  getSelectedFile(selectedFile) {
    this.selectedFile = selectedFile;
    this.imageUpload(selectedFile);
  }
  navigateToDashboard() {
    this._route.navigate([ABS_USER_MANAGEMENT]);

  }
}
