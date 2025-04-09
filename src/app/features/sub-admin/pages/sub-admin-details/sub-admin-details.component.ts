import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatInputModule } from "@angular/material/input";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
// import { CountryISO, NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { Subscription } from "rxjs";
import { LIMIT } from "src/app/constants/validators";
import { SubAdminService } from "../../service/sub-admin/sub-admin.service";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonService } from "src/app/services/common/common.service";
import { ToastService } from "src/app/components/toast-notification/toast.service";
// import { BC_SUB_ADMIN_DETAILS } from "src/app/constants/breadcrumb-routes";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
// import { ROLES_ACCESS, SUB_ADMINS } from "src/app/constants/routes";
import { FormatStatusPipe } from "src/app/pipes/format-status/format-status.pipe";
import { BC_VIEW_SUBADMIN } from "src/app/constants/breadcrumb-routes";
import { STRING_CONST } from "src/app/constants/string";
import { SUB_ADMIN_MANAGEMENT } from "src/app/constants/routes";

@Component({
  selector: "app-sub-admin-details",
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    // NgxIntlTelInputModule,
    DataLoaderComponent,
    FormatStatusPipe
  ],
  templateUrl: "./sub-admin-details.component.html",
  styleUrls: ["./sub-admin-details.component.scss"],
})
export class SubAdminDetailsComponent implements OnInit, OnDestroy {
  subAdminForm!: FormGroup;
  roleName: any;
  subAdminData: any;
  subscriptions: Subscription[] = [];
  // CountryISO = CountryISO;
  _limit = LIMIT;
  subAdminId: any;
  isApiCallInProgress = false;
  constructor(
    private _fb: FormBuilder,
    private _subAdminService: SubAdminService,
    private _bc: BreadcrumbService,
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _common: CommonService,
    private _toast: ToastService
  ) {}
  ngOnInit(): void {
  
    this._bc.setBreadcrumb(BC_VIEW_SUBADMIN);
    this.createForm();
    if (this._actRoute.snapshot.params[STRING_CONST.SUB_ADMIN_ID]) {
      this.subAdminId = this._common.decryption(
        this._actRoute.snapshot.params[STRING_CONST.SUB_ADMIN_ID]
      );
      this.getSubAdminDetails(this.subAdminId);
    }
  }
  createForm() {
    this.subAdminForm = this._fb.group({
      name: [{ value: "", disabled: true }],
      email: [{ value: "", disabled: true }],
      mobileNo: [{ value: "", disabled: true }],
      roleId: [{ value: "", disabled: true }],
    });
  }
  get f() {
    return this.subAdminForm.controls;
  }

  getSubAdminDetails(subAdminId: string) {
  this.isApiCallInProgress = true;

    this.subscriptions.push(this._subAdminService
      .getSubAdminDetail({subAdminId:subAdminId})
      .subscribe((res: any) => {
  this.isApiCallInProgress = false;

        this.subAdminData = res.data;
        this.subAdminForm.patchValue({
          name: this.subAdminData.name,
          email: this.subAdminData.email,
          mobileNo:
            (this.subAdminData.countryCode
              ? this.subAdminData.countryCode + "  "
              : "") + this.subAdminData.mobileNo,
          roleId: this.subAdminData.role,
        });
      }, (error) => {
        this.isApiCallInProgress = false;
        if (error.statusCode == 400) {
          this._toast.error(error.message);
          this._common.navigate([`${SUB_ADMIN_MANAGEMENT.fullUrl}`]);
        }}));
  }
  /**
   * @UNSUBSCRIPTION Unsubscribe all subscriptions to avoid memory leak
   */
  ngOnDestroy() {
    if (this.subscriptions.length > 0) {
      this._common.unsubscribe(this.subscriptions);
    }
  }
}
