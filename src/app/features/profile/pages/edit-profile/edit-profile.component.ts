import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { Router, RouterModule } from "@angular/router";
import { ACCOUNT_ERROR_MESSAGES } from "src/app/constants/messages";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { CommonService } from "src/app/services/common/common.service";
import { LIMIT, REGEX } from "src/app/constants/validators";
import { MatDialog } from "@angular/material/dialog";
import { ProfileService } from "../../service/profile.service";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LazyImageComponent } from "src/app/components/lazy-image/lazy-image.component";
import { UploadImageComponent } from "../upload-image/upload-image.component";
import { UploadImgComponent } from "src/app/components/upload-img/upload-img.component";
import { StorageService } from "src/app/services/storage/storage.service";
import { ErrorMessagePipe } from "src/app/pipes/error-message/error-message.pipe";
import { ABS_PROFILE } from "src/app/constants/absolute-routes";
import { ButtonComponent } from "src/app/components/button/button.component";
import { firstValueFrom } from "rxjs";
import { API_STATUS } from "src/app/constants/number";
import { NoLeadingSpaceDirective } from "src/app/directives/no-leading-space/no-leading-space.directive";
import { FileUploadService } from "src/app/services/fileUpload/file-upload.service";
import { HttpResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ADMIN_TYPES } from "src/app/constants/roles";


const MODULES = [
  ReactiveFormsModule,
  MatInputModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatIconModule,
  MatButtonModule,
  RouterModule,
  ErrorMessagePipe,
  MatTooltipModule,
  LazyImageComponent,
  UploadImgComponent,
  ButtonComponent,
  NoLeadingSpaceDirective
];
@Component({
  selector: "app-edit-profile",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit, AfterViewInit {
  profileForm!: FormGroup;
  selectedFile: any;
  limit = LIMIT;
  errorMsg = ACCOUNT_ERROR_MESSAGES;
  validation = LIMIT;
  passwordHide = false;
  imagePreview = this.storage.profileDetail.profilePicture;
  profileUpdateInProgress: boolean;
  profileImageUploadInProgress: boolean;
  adminTypes = ADMIN_TYPES;

  constructor(
    private _fb: FormBuilder,
    private _common: CommonService,
    public storage: StorageService,
    private _profile: ProfileService,
    private _toast: ToastService,
    private _dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private _route: Router,
    private readonly _fileUploadService: FileUploadService,
  ) { }

  ngOnInit() {
    this.createForm();
   this._common.scrollTop();
    this.patchProfileInfo();
    this.passwordHide = false

  }
  ngAfterViewInit(): void {
    this.createEmptyField();
  }
  createForm() {
    this.profileForm = this._fb.group({
      name: [
        "",
        [
          Validators.required,
          Validators.maxLength(this.validation.MAX_NAME_LENGTH),
          Validators.minLength(this.validation.MIN_NAME_LENGTH),
          Validators.pattern(REGEX.NAME),
        ],
      ],
      email: ["", Validators.pattern(REGEX.EMAIL)],
    });
  }

  get frmCtrl(): any {
    return this.profileForm.controls;
  }


  patchProfileInfo() {
    this.profileForm.patchValue({
      name: this.storage.profileDetail.name,
      email: this.storage.profileDetail.email
    });
    this.frmCtrl["email"].disable();
  }
  createEmptyField() {
    this.passwordHide = false;
  }
  imageUpload(selectedFile) {
    const dialog = this._dialog.open(UploadImageComponent, {
      panelClass: "account-popup",
      data: selectedFile,
      width: "400px",
    });
    dialog.afterClosed().subscribe((res) => {
      if (res) {
        this.profileImageUploadInProgress = true;
        this.uploadMediaFiles(res);
      }
    });
  } 
  async uploadMediaFiles(file: any) {
    if (file.removeImage) {
      this.imagePreview = ""
    } else {
      let fileName = file?.file?.name;
      let fileTypeValue = file?.file?.type
      let fileForUpload = file.realFile
      let res = await this._fileUploadService.generatePresignedUrl(fileName,fileTypeValue).toPromise();
      let event = await this._fileUploadService.uploadFile(res.data?.url, fileTypeValue, fileForUpload , true);
      if (event instanceof HttpResponse && event.status === 200) {
        this.imagePreview = environment.s3.IMAGE_PREFIX + (fileName || new Date().getTime().toString());
      }
    }

    this.profileImageUploadInProgress = false;
    this.profileForm.markAsDirty();
  }

  getSelectedFile(selectedFile) {
    this.selectedFile = selectedFile;
    this.imageUpload(selectedFile);
  }

  async profileHandler() {
    this.updateProfileNamePic();
  }

  async updateProfileNamePic() {
    let formValue = this.profileForm.value;
    const requestData = { 
      name: formValue.name,
      profilePicture: this.imagePreview,
      // deviceToken:this.storage?.firebaseToken
    };
    try {
      const responseData = await firstValueFrom(this._profile.updateProfileInfo(requestData));
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.profileForm.markAsPristine();
        this.storage.profileDetail.profilePicture = this.imagePreview;
        this.storage.profileDetail.name = requestData.name;
        this._toast.success("Profile updated successfully");
        this.profileUpdateInProgress = false;
        this.navigateToProfile();
      }
    } catch (error) {
      this.profileUpdateInProgress = false;
      this._toast.error(error.message);
    }
  }

  profileValidation() {
    for (const key in this.profileForm.value) {
      if (this.profileForm.value.hasOwnProperty(key)) {
        if (
          this.frmCtrl[key].value &&
          typeof this.frmCtrl[key].value === "string"
        ) {
          this.frmCtrl[key].patchValue(this.frmCtrl[key].value.trim());
        }
      }
    }
  }

  navigateToProfile() {
    this._route.navigate([ABS_PROFILE])
  }
}
