import { Component, OnDestroy, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { REGEX } from "src/app/constants/validators";
import {
  ACCOUNT_ERROR_MESSAGES,
  LISTING_COMMON_MESSAGES,
  MODULE_ID_OF,
} from "src/app/constants/messages";
import { firstValueFrom, Subscription } from "rxjs";
import {
  FORM_CONTROL,
  MODULE,
  MODULE_ID,
  PERMISSION_MODULE,
  ROLE,
} from "src/app/constants/roles";
import { CommonService } from "src/app/services/common/common.service";
import { isObjEmpty } from "src/app/constants/helper";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { RoleService } from "../../service/role/role.service";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import {
  BC_ROLES_ACCESS_ADD,
  BC_ROLES_ACCESS_EDIT,
} from "src/app/constants/breadcrumb-routes";
import { ActivatedRoute, Router } from "@angular/router";
import { FormatStatusPipe } from "src/app/pipes/format-status/format-status.pipe";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/components/confirmation-modal/confirmation-modal.component";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MANAGE_ROLES } from "src/app/constants/routes";
import { ButtonComponent } from "src/app/components/button/button.component";
import { ErrorMessagePipe } from "src/app/pipes/error-message/error-message.pipe";
import { ApiResponse } from "src/app/constants/interface";
import { API_STATUS } from "src/app/constants/number";
import { STRING_CONST } from "src/app/constants/string";
const MODULES = [
  ReactiveFormsModule,
  MatInputModule,
  MatFormFieldModule,
  MatButtonModule,
  MatIconModule,
  MatCheckboxModule,
  FormsModule,
  FormatStatusPipe,
  MatDialogModule,
  DataLoaderComponent,
  MatTooltipModule,
  ButtonComponent,
  ErrorMessagePipe,
];
@Component({
  selector: "app-add-role",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./add-role.component.html",
  styleUrls: ["./add-role.component.scss"],
})
export class AddRoleComponent implements OnInit, OnDestroy {
  roleForm!: FormGroup;
  errMsg = ACCOUNT_ERROR_MESSAGES;
  adminId: string;
  status: string;
  roles = [];
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
  public actionInprogress = false;
  constructor(
    private _fb: FormBuilder,
    private _common: CommonService,
    private _toast: ToastService,
    private _roleService: RoleService,
    private _bc: BreadcrumbService,
    private _actRoute: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.createForm();
    this.adminRoleHandler();
  }
  createForm() {
    this.roleForm = this._fb.group({
      name: [
        "",
        [Validators.required, Validators.pattern(REGEX.NAME)],
      ],
      allPermission: [false],
      viewAll: [false],
      editAll: [false],
      viewDashboard: [false],
      editDashboard: [false],
      viewUserMgmt: [false],
      editUserMgmt: [false],
      viewRequestMgmt: [false],
      editRequestMgmt: [false],
      viewSupport: [false],
      editSupport: [false],
      viewSubAdminMgmt: [false],
      editSubAdminMgmt: [false],
      viewNotificationMgmt: [false],
      editNotificationMgmt: [false],
      viewCMSMgmt: [false],
      editCMSMgmt: [false],
      viewVersionMgmt: [false],
      editVersionMgmt: [false],
      editJobMgmt: [false],
      viewJobMgmt: [false],
      editDamageReport: [false],
      viewDamageReport: [false],
    });
  }
  get frmCtrl() {
    return this.roleForm.controls;
  }
  adminRoleHandler() {
    this.setBreadcrumbAndFetchDetail();
  }

  subAdminRoleHandler() {
    let permission = this._common.getPermissionByModuleId(
      MODULE_ID_OF.SUB_ADMIN_MANAGEMENT
    );
    if (!isObjEmpty(permission)) {
      if (permission.edit) {
        this.setBreadcrumbAndFetchDetail();
      }
      if (!permission.edit) {
        this.cancelHandler();
      }
    }
  }

  cancelHandler() {
    this._router.navigate([MANAGE_ROLES.fullUrl]);
  }

  setBreadcrumbAndFetchDetail() {
    if (this._actRoute.snapshot.params[STRING_CONST.SUB_ADMIN_ID]) {
      this.adminId = this._common.decryption(
        this._actRoute.snapshot.params[STRING_CONST.SUB_ADMIN_ID]
      );
      this._bc.setBreadcrumb(BC_ROLES_ACCESS_EDIT);
      this.getAdminDetails();
    } else {
      this._bc.setBreadcrumb(BC_ROLES_ACCESS_ADD);
    }
  }

  getAdminDetails() {
    this.isRoleApiCallInProgress = true;

    const data ={
      roleId:this.adminId
    }
    this.subscriptions.push(
      this._roleService.getRoleDetail(data).subscribe(
        (res: any) => {
          this.isRoleApiCallInProgress = false;
          const data = res.data;
          this.status = res.data.status;
          this.roleForm.patchValue({
            name: data.name,
          });
          data.permissions.forEach((element) => {
            FORM_CONTROL[element.moduleId].forEach((control) => {
              this.frmCtrl[control.control].setValue(element[control.key]);
              this.setPermissionArray(
                control.control,
                MODULE_ID[element.moduleId],
                control.key
              );
            });
          });

          this.frmCtrl["allPermission"].setValue(this.checkAllPermissions());
          this.frmCtrl["viewAll"].setValue(
            this.checkPermissions(this.viewPermissions)
          );
          this.frmCtrl["editAll"].setValue(
            this.checkPermissions(this.editPermissions)
          );
        },
        (error) => {
          this.isRoleApiCallInProgress = false;
          if (error.statusCode == 400) {
            this._toast.error(error.message);
            this.cancelHandler();
          }
        }
      )
    );
  }

  deleteUser() {
    const data = {
      roleId: this.adminId,
      status:'DELETED'
    };
    const dialog = this._dialog
      .open(ConfirmationModalComponent, {
        panelClass: "account-popup",
        width: "480px",
        data: {
          title: `${LISTING_COMMON_MESSAGES.DELETE_TITLE} role?`,
          message: `${LISTING_COMMON_MESSAGES.DELETE_MSG} this role?`,
        },
      })
      .afterClosed()
      .subscribe((res: any) => {
        if (res) {
          this.subscriptions.push(this._roleService.EditRole(data).subscribe((res) => {
            this._toast.success(res.message);
            this.navigate();
          }));
        }
      });
  }
  updateStatus() {
    const data = {
      roleId: this.adminId,
      status: this.status === "BLOCKED" ? "UN_BLOCKED" : "BLOCKED",
    };
    const dialog = this._dialog.open(ConfirmationModalComponent, {
      panelClass: "account-popup",
      width: "480px",
      data: {
        title:
          this.status == "UN_BLOCKED"
            ? `${LISTING_COMMON_MESSAGES.BLOCK_TITLE} role?`
            : `${LISTING_COMMON_MESSAGES.ACTIVATE_TITLE} this role?`,
        message:
          this.status == "BLOCKED"
            ? `${LISTING_COMMON_MESSAGES.ACTIVATE_MSG} this role?`
            : `${LISTING_COMMON_MESSAGES.BLOCK_MSG} this role?`,
      },
    });
    dialog.afterClosed().subscribe((res: any) => {
      if (res) {
        this.subscriptions.push(this._roleService
          .EditRole(data)
          .subscribe((res) => {
            this._toast.success(
              res.message 
            );
            this.navigate();
          }));
      }
    });
  }
  async adminHandler() {
    try {
      await Promise.all([
        ...this.viewPermissions.map((item) =>
          this.setPermissionArray(item, PERMISSION_MODULE[item], "view")
        ),
        ...this.editPermissions.map((item) =>
          this.setPermissionArray(item, PERMISSION_MODULE[item], "edit")
        ),
      ]);

      if (this.roleForm.invalid) {
        return;
      }

      if (this.adminId) {
        await this.editAdmin();
      } else {
        await this.addAdmin();
      }
    } catch (error) {
      console.error("Error in adminHandler:", error);
      // Handle error appropriately, e.g., showing a toast or notification
    }
  }
  async addAdmin() {
    this.actionInprogress = true;
    const body = {
      name: this.roleForm.get("name").value,
      permissions: this.permissionsArr,
    };
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._roleService.AddRole(body)
      );
      if (responseData.statusCode === API_STATUS.TWO_ZERO_ONE) {
      this.cancelHandler();
        this.actionInprogress = false;
        this._toast.success(responseData.message);
      }
    } catch (error) {
      this._toast.error(error.message);
      this.cancelHandler();
      this.actionInprogress = false;
    }
  }

  async editAdmin() {
    const body: any = {
      name: this.roleForm.get("name").value,
      permissions: this.permissionsArr,
    };
    body.roleId = this.adminId;
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._roleService.EditRole(body)
      );
      if (responseData.statusCode === API_STATUS.TWO_ZERO_TWO) {
        this.actionInprogress = false;
      this.cancelHandler();
        this.navigate(responseData.message);
      }
    } catch (error) {
      this._toast.error(error.message);
      this.cancelHandler();
      this.actionInprogress = false;
    }
  }

  navigate(mssg?: string) {
    if (mssg) {
      this._toast.success(mssg);
    }
    this._router.navigate([MANAGE_ROLES.fullUrl]);
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
      if (viewOrEdit == "view") {
        this.setOtherControl(otherControls, frmKey);
        if (!this.roleForm.value[frmKey]) {
          if (this.editPermissions[index]) {
            this.frmCtrl[this.editPermissions[index]].setValue(
              this.roleForm.value[frmKey]
            );
          }
          this.frmCtrl["editAll"].setValue(this.roleForm.value[frmKey]);
        }
      } else if (viewOrEdit == "viewAndEdit") {
        this.setOtherControl(otherControls, frmKey);
      } else if (viewOrEdit == "edit") {
        if (this.roleForm.value[frmKey]) {
          this.setOtherControl(otherControls, frmKey);
        } else {
          if (permissions[index].startsWith("view")) {
            this.frmCtrl[permissions[index]].setValue(true);
          } else {
            this.frmCtrl[permissions[index]].setValue(
              this.roleForm.value[frmKey]
            );
          }
          this.frmCtrl["viewAll"].setValue(true);
          this.frmCtrl["editAll"].setValue(false);
        }
      }
    }
    if (setAllPermission) {
      this.frmCtrl["allPermission"].setValue(this.checkAllPermissions());
    }
  }

  setOtherControl(otherControls, frmKey) {
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

  alAdminPermissions(arr) {
    this.unCheckPermissions();
    for (let i = 0; i < arr.length; i++) {
      let key = arr[i];
      this.frmCtrl[key].setValue(true);
    }
  }

  unCheckPermissions() {
    let arr = [...this.viewPermissions, ...this.editPermissions];
    for (let i = 0; i < arr.length; i++) {
      let key = arr[i];
      this.frmCtrl[key].setValue(false);
    }
    this.frmCtrl["viewAll"].setValue(false);
    this.frmCtrl["editAll"].setValue(false);
  }

  viewSingleSelection(key, editKey) {
    if (!this.frmCtrl[key].value) {
      this.frmCtrl[editKey].setValue(this.frmCtrl[key].value);
    }
    this.frmCtrl["viewAll"].setValue(
      this.checkPermissions(this.viewPermissions)
    );
    this.frmCtrl["allPermission"].setValue(this.checkAllPermissions());
    this.frmCtrl["editAll"].setValue(
      this.checkPermissions(this.editPermissions)
    );
  }

  editSingleSelection(key, viewKey) {
    if (this.frmCtrl[key].value) {
      this.frmCtrl[viewKey].setValue(this.frmCtrl[key].value);
    }
    this.frmCtrl["viewAll"].setValue(
      this.checkPermissions(this.viewPermissions)
    );
    this.frmCtrl["editAll"].setValue(
      this.checkPermissions(this.editPermissions)
    );
    this.frmCtrl["allPermission"].setValue(this.checkAllPermissions());
  }
  
  setPermissionArray(key, module, boolVal) {
    const newValue = this.frmCtrl[key].value;
    const moduleId = ROLE[module] ? ROLE[module].moduleId : null; // Get the moduleId from ROLE object
    if (!moduleId) {
      return;
    }
  
    const roleIndex = this.permissionsArr.findIndex(
      (item) => item.moduleId === moduleId // Compare with moduleId directly
    );
  
    if (roleIndex >= 0) {
      const existingPermission = this.permissionsArr[roleIndex];
  
      if (boolVal === 'view') {
        this.permissionsArr[roleIndex].view = newValue;
      } else if (boolVal === 'edit') {
        this.permissionsArr[roleIndex].edit = newValue;
      }
  
      if (this.permissionsArr[roleIndex].view && this.permissionsArr[roleIndex].edit) {
        this.permissionsArr[roleIndex] = {
          ...existingPermission,
          view: this.permissionsArr[roleIndex].view,
          edit: this.permissionsArr[roleIndex].edit,
        };
      }
    } else {
      const newPermission = {
        moduleId: moduleId, // Set the moduleId from ROLE
        module: ROLE[module].module, // Module name
        view: boolVal === 'view' ? newValue : false,
        edit: boolVal === 'edit' ? newValue : false,
      };
      this.permissionsArr.push(newPermission);
    }
  
    this.permissionsArr = this.permissionsArr.filter(
      (item) => item.view || item.edit
    );
  
  }
  
  onlyNumber(e) {
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.keyCode === 67 && e.ctrlKey === true) || // Allow: Ctrl+C
      // (e.keyCode === 86 && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.keyCode === 88 && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.keyCode === 65 && e.metaKey === true) || // Cmd+A (Mac)
      (e.keyCode === 67 && e.metaKey === true) || // Cmd+C (Mac)
      (e.keyCode === 86 && e.metaKey === true) || // Cmd+V (Mac)
      (e.keyCode === 88 && e.metaKey === true) || // Cmd+X (Mac)
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    if (e.keyCode === 86 && e.ctrlKey === true) {
      return; // Allow: Ctrl+V
    }
    if (
      (e.keyCode >= 97 && e.keyCode <= 122) ||
      (e.keyCode >= 65 && e.keyCode <= 90)
    ) {
      return;
    }
    if (
      (e.shiftKey || e.keyCode < 48 || e.keyCode > 57) &&
      (e.keyCode < 96 || e.keyCode > 105)
    ) {
      e.preventDefault();
    }
  }
  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this._common.unsubscribe(this.subscriptions);
    }
  }
}
