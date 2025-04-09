import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { SubAdminService } from "../../service/sub-admin/sub-admin.service";
import { Subscription, switchMap } from "rxjs";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
// import { CountryISO, NgxIntlTelInputModule } from "ngx-intl-tel-input";
import { LIMIT, REGEX } from "src/app/constants/validators";
import { ActivatedRoute, Router } from "@angular/router";

import { CommonService } from "src/app/services/common/common.service";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import {
  LISTING_COMMON_MESSAGES,
  SUB_ADMIN_ERROR_MESSAGES,
} from "src/app/constants/messages";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { FormatStatusPipe } from "src/app/pipes/format-status/format-status.pipe";
import { ConfirmationModalComponent } from "src/app/components/confirmation-modal/confirmation-modal.component";
import { MatDialog } from "@angular/material/dialog";
import { MatTooltipModule } from "@angular/material/tooltip";
import {
  BC_ADD_SUBADMIN,
  BC_EDIT_SUBADMIN,
} from "src/app/constants/breadcrumb-routes";
import { SUB_ADMIN_MANAGEMENT } from "src/app/constants/routes";
import { ButtonComponent } from "src/app/components/button/button.component";
import { ErrorMessagePipe } from "src/app/pipes/error-message/error-message.pipe";
import { STRING_CONST } from "src/app/constants/string";

@Component({
  selector: "app-sub-admin-view",
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
    ErrorMessagePipe,
    DataLoaderComponent,
    FormatStatusPipe,
    MatTooltipModule,
    ButtonComponent,
  ],
  templateUrl: "./sub-admin-view.component.html",
  styleUrls: ["./sub-admin-view.component.scss"],
})
export class SubAdminViewComponent implements OnInit, OnDestroy {
  subAdminForm!: FormGroup;
  roleName: any;
  subscriptions: Subscription[] = [];
  // CountryISO = CountryISO;
  _limit = LIMIT;
  subAdminId: any;
  subAdminData: any;
  status: string;
  errMsg = SUB_ADMIN_ERROR_MESSAGES;
  separateDialCode = true;
  isLoading = true
  constructor(
    private _fb: FormBuilder,
    private _subAdminService: SubAdminService,
    private _bc: BreadcrumbService,
    private _router: Router,
    private _actRoute: ActivatedRoute,
    private _common: CommonService,
    private _toast: ToastService,
    private _dialog: MatDialog
  ) {}
 ngOnInit() {
    this.createForm();
      this.setBreadcrumbAndFetchDetail();
  }
  setBreadcrumbAndFetchDetail() {
    if (this._actRoute.snapshot.params[STRING_CONST.SUB_ADMIN_ID]) {
      this.subAdminId = this._common.decryption(
        this._actRoute.snapshot.params[STRING_CONST.SUB_ADMIN_ID]
      );
      this._bc.setBreadcrumb(BC_EDIT_SUBADMIN);
      this.getSubAdminDetails(this.subAdminId);
    } else {
      this._bc.setBreadcrumb(BC_ADD_SUBADMIN);
      this.getRoleList();
    }
  }
  createForm() {
    this.subAdminForm = this._fb.group({
      name: [
        "",
        [Validators.required, Validators.pattern(REGEX.NAME),Validators.minLength(LIMIT.MIN_NAME_LENGTH)],
      ],
      email: ["", [Validators.required, Validators.pattern(REGEX.EMAIL)]],
      roleId: ["", Validators.required],
    });
  }
  get f() {
    return this.subAdminForm.controls;
  }
  getRoleList() {
    this.subscriptions.push(
      this._subAdminService.getRoleList().subscribe((res: any) => {
        this.roleName = res.data;
      })
    );
  }

  deleteUser() {
    const data = {
      subAdminId: this.subAdminId,
      status:'DELETED'
    };
    const dialog = this._dialog
      .open(ConfirmationModalComponent, {
        panelClass: "account-popup",
        width: "480px",
        data: {
          title: `${LISTING_COMMON_MESSAGES.DELETE_TITLE} sub Admin?`,
          message: `${LISTING_COMMON_MESSAGES.DELETE_MSG} this sub Admin?`,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) {
          this.subscriptions.push(this._subAdminService.EditSubAdmin(data).subscribe((res) => {
            this._toast.success("SubAdmin deleted successfully");
            this.navigate();
          }));
        }
      });
  }
  updateStatus() {
    const data = {
      subAdminId: this.subAdminId,
      status: this.subAdminData.status === "BLOCKED" ? "UN_BLOCKED" : "BLOCKED",
    };
    const dialog = this._dialog.open(ConfirmationModalComponent,{
      panelClass: "account-popup",
      width: "480px",
      data: {
        title: this.status == "UN_BLOCKED"
        ? `${LISTING_COMMON_MESSAGES.BLOCK_TITLE} sub Admin?`
        : `${LISTING_COMMON_MESSAGES.ACTIVATE_TITLE} this sub Admin?`,
        message:this.status == "BLOCKED"
        ? `${LISTING_COMMON_MESSAGES.ACTIVATE_MSG} this sub Admin?`
        : `${LISTING_COMMON_MESSAGES.BLOCK_MSG} this sub Admin?`
      },
    })
    dialog.afterClosed().subscribe((res:any)=>{
      if(res){
        this.subscriptions.push(this._subAdminService
      .EditSubAdmin(data)
      .subscribe((res) => {
            if(res){
              this._toast.success(
              res.message
              );
              this.navigate();
          }}));
      }
    })
  }

  getSubAdminDetails(subAdminId: string) {
    this.subscriptions.push(
      this._subAdminService.getRoleList().pipe(
        switchMap((res: any) => {
          this.roleName = res.data;
          return this._subAdminService.getSubAdminDetail({ subAdminId });
        })
      ).subscribe(
        (res: any) => {
          this.subAdminData = res.data;
          this.status = res.data.status;
          const selectedRole = this.roleName.find(
            (item) => item._id === this.subAdminData?.roleId
          );
          this.subAdminForm.patchValue({
            name: this.subAdminData.name,
            email: this.subAdminData.email,
            roleId: selectedRole,
          });
          this.subAdminForm.controls["email"].disable();
          this.isLoading = false
        },
        (error) => {
          if (error.statusCode == 400) {
            this._toast.error(error.message);
            this._common.navigate([`${SUB_ADMIN_MANAGEMENT.fullUrl}`]);
          this.isLoading = false

          }
        }
      )
    );
  }
  

  addNewSubAdmin() {
    const { name, email, roleId } = this.subAdminForm.value;
    const body: any = {
      name,
      email,
      roleId: roleId?._id,
      roleName: roleId?.name,
    };
    this.subscriptions.push(
      this._subAdminService.AddSubAdmin(body).subscribe((res) => {
        this.navigate(res.message);
      })
    );
  }

  updateSubAdmin() {
    const { name, email, roleId, mobileNo } = this.subAdminForm.value;
    const body: any = {
      name,
      email,
      roleId: roleId?._id,
      roleName: roleId?.name,
    };
    body.subAdminId = this.subAdminId;
    this.subscriptions.push(this._subAdminService.EditSubAdmin(body).subscribe(res => {
      this.navigate(res.message);
    }))
  }
  trimValues() {
    for (const key in this.subAdminForm.value) {
      if (
        this.subAdminForm.value.hasOwnProperty(key) &&
        typeof this.f[key].value == "string"
      ) {
        this.f[key].setValue(this.f[key].value.trim());
      }
    }
  }
  checkValidation() {
    this.trimValues();
  }

  subAdminHandler() {
    this.checkValidation();
    if (this.subAdminForm.valid) {
      if (this.subAdminId) {
        if (this.subAdminForm.dirty) {
          this.updateSubAdmin();
        } else {
          this.cancelHandler();
        }
      } else {
        this.addNewSubAdmin();
      }
    }
  }
  cancelHandler() {
    this._common.locationBack();
  }

  navigate(mssg?: string) {
    if (mssg) {
      this._toast.success(mssg);
    }
    this._router.navigate([SUB_ADMIN_MANAGEMENT.fullUrl]);
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
