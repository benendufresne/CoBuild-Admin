import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { BC_ROLES_ACCESS_DETAILS } from "src/app/constants/breadcrumb-routes";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { FormatStatusPipe } from "src/app/pipes/format-status/format-status.pipe";
import { CommonService } from "src/app/services/common/common.service";
import { Subscription } from "rxjs";
import {
  ACCOUNT_ERROR_MESSAGES,
  MODULE_ID_OF,
} from "src/app/constants/messages";
import { isObjEmpty } from "src/app/constants/helper";
import { RoleService } from "../../service/role/role.service";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { ActivatedRoute, Router } from "@angular/router";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { MANAGE_ROLES } from "src/app/constants/routes";
import { StorageService } from "src/app/services/storage/storage.service";
import { FORM_CONTROL, MODULE, MODULE_ID } from "src/app/constants/roles";
import { STRING_CONST } from "src/app/constants/string";

@Component({
  selector: "app-view-role",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    FormatStatusPipe,
    DataLoaderComponent,
  ],
  templateUrl: "./view-role.component.html",
  styleUrls: ["./view-role.component.scss"],
})
export class ViewRoleComponent implements OnInit, OnDestroy {
  roleForm!: FormGroup;
  errMsg = ACCOUNT_ERROR_MESSAGES;
  roleId: string;
  status: string;
  roles = [];
  adminData: any;
  isRoleApiCallInProgress = false;
  subscriptions: Subscription[] = [];
  selectedRolePermission = [];
  permissionsArr = [];
  module = MODULE;
  moduleId = MODULE_ID;
  viewPermissions = [
    "viewDashboard",
    "viewUserMgmt",
    "viewSubAdminMgmt",
    "viewJobMgmt",
    "viewRequestMgmt",
    "viewDamageReport",
    "viewSupport",
    "viewNotificationMgmt",
    "viewCMSMgmt",
    "viewVersionMgmt",
  ];
  editPermissions = [
    "editDashboard",
    "editUserMgmt",
    "editSubAdminMgmt",
    "editJobMgmt",
    "editRequestMgmt",
    "editDamageReport",
    "editSupport",
    "editNotificationMgmt",
    "editCMSMgmt",
    "editVersionMgmt",
  ];
  constructor(
    private _bc: BreadcrumbService,
    private _fb: FormBuilder,
    private _common: CommonService,
    private _storage: StorageService,
    private _admin: RoleService,
    private _toast: ToastService,
    private _router: Router,
    private _actRoute: ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.createForm();
    this.validateIdAndFetchDetails();
    this._bc.setBreadcrumb(BC_ROLES_ACCESS_DETAILS);

    this._common.scrollTop();
  }
  createForm() {
    this.roleForm = this._fb.group({
      roleName: [{ value: "", disabled: true }],
      allPermission: [{ value: false, disabled: true }],
      viewAll: [{ value: false, disabled: true }],
      editAll: [{ value: false, disabled: true }],
      viewDashboard: [{ value: false, disabled: true }],
      editDashboard: [{ value: false, disabled: true }],
      viewUserMgmt: [{ value: false, disabled: true }],
      editUserMgmt: [{ value: false, disabled: true }],
      viewRequestMgmt: [{ value: false, disabled: true }],
      editRequestMgmt: [{ value: false, disabled: true }],
      viewSupport: [{ value: false, disabled: true }],
      editSupport: [{ value: false, disabled: true }],
      viewSubAdminMgmt: [{ value: false, disabled: true }],
      editSubAdminMgmt: [{ value: false, disabled: true }],
      viewNotificationMgmt: [{ value: false, disabled: true }],
      editNotificationMgmt: [{ value: false, disabled: true }],
      viewCMSMgmt: [{ value: false, disabled: true }],
      editCMSMgmt: [{ value: false, disabled: true }],
      viewVersionMgmt: [{ value: false, disabled: true }],
      editVersionMgmt: [{ value: false, disabled: true }],
      viewJobMgmt: [{ value: false, disabled: true }],
      editJobMgmt: [{ value: false, disabled: true }],
      viewDamageReport: [{ value: false, disabled: true }],
      editDamageReport: [{ value: false, disabled: true }],
    });
  }
  get frmCtrl() {
    return this.roleForm.controls;
  }
  permissionHandler() {
    if (this._storage.profileDetail.userType == "ADMIN") {
      return true;
    }
    let permission = this._common.getPermissionByModuleId(
      MODULE_ID_OF.SUB_ADMIN_MANAGEMENT
    );
    if (!isObjEmpty(permission)) {
      if (permission.edit) {
        return true;
      }
    }
    return false;
  }

  validateIdAndFetchDetails() {
    if (this._actRoute.snapshot.params[STRING_CONST.SUB_ADMIN_ID]) {
      this.roleId = this._common.decryption(
        this._actRoute.snapshot.params[STRING_CONST.SUB_ADMIN_ID]
      );
      this.fetchUserDetails();
    }
  }

  fetchUserDetails() {
    this.isRoleApiCallInProgress = true;
    const data ={
      roleId:this.roleId
    }
    this.subscriptions.push(
      this._admin.getRoleDetail(data).subscribe((res: any) => {
        this.isRoleApiCallInProgress = false;
        if (res.statusCode == 200) {
          this.adminData = res.data;
          this.roleForm.patchValue({
            roleName: this.adminData.name,
          });
          this.adminData.permissions.forEach(element => {
            FORM_CONTROL[element.moduleId].forEach(control => {
              this.frmCtrl[control.control].setValue(element[control.key]);
            })
          });
          this.frmCtrl['allPermission'].setValue(this.checkAllPermissions());
          this.frmCtrl['viewAll'].setValue(this.checkPermissions(this.viewPermissions));
          this.frmCtrl['editAll'].setValue(this.checkPermissions(this.editPermissions));
        } else {
          this._toast.error(res.message);
          this._router.navigate([`${MANAGE_ROLES.fullUrl}`]);

        }
      }, (error) => {
        this.isRoleApiCallInProgress = false;
        if (error.statusCode == 400) {
          this._toast.error(error.message);
          this._router.navigate([`${MANAGE_ROLES.fullUrl}`]);

        }
      })
    );
  }

  setPermission(
    permissions,
    frmKey,
    viewOrEdit,
    setAllPermission = false,
    otherControls = []
  ) {
    for (let index in permissions) {
      this.frmCtrl[permissions[index]].setValue(this.roleForm.value[frmKey]);
    }
    if (setAllPermission) {
      this.frmCtrl["allPermission"].setValue(this.checkAllPermissions());
    }
    if (otherControls.length) {
      for (let i in otherControls) {
        this.frmCtrl[otherControls[i]].setValue(this.roleForm.value[frmKey]);
      }
    }
  }

  checkPermissions(permissions) {
    let check = true;
    for (let i = 0; i < permissions.length; i++) {
      if (!this.frmCtrl[permissions[i]].value) {
        check = false;
        break;
      }
    }
    return check;
  }

  checkAllPermissions() {
    if (
      this.checkPermissions(this.viewPermissions) &&
      this.checkPermissions(this.editPermissions)
    ) {
      return true;
    }
    return false;
  }

  /**
   * @UNSUBSCRIPTION Unsubscribe all subscriptions to avoid memory leak
   */
  ngOnDestroy() {
    // this._bc.setActionButton([]);
    if (this.subscriptions.length > 0) {
      this._common.unsubscribe(this.subscriptions);
    }
  }
}
