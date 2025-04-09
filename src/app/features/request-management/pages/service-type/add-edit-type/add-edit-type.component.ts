import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { firstValueFrom } from "rxjs";
import { ButtonComponent } from "src/app/components/button/button.component";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { ApiResponse, IServiceTypeForm } from "src/app/constants/interface";
import { API_STATUS } from "src/app/constants/number";
import { STRING_CONST } from "src/app/constants/string";
import { LIMIT, REGEX } from "src/app/constants/validators";
import { NoLeadingSpaceDirective } from "src/app/directives/no-leading-space/no-leading-space.directive";
import { RequestManagementService } from "src/app/features/request-management/service/request-management.service";
import { ErrorMessagePipe } from "src/app/pipes/error-message/error-message.pipe";

const MODULES =[
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  ButtonComponent,
  NoLeadingSpaceDirective,
  DataLoaderComponent,
  ErrorMessagePipe,
  MatSelectModule
]
@Component({
  selector: "app-add-edit-type",
  standalone: true,
  imports: [CommonModule,...MODULES],
  templateUrl: './add-edit-type.component.html',
  styleUrl: './add-edit-type.component.scss'
})
export class AddEditTypeComponent implements OnInit {
  public isLoading:boolean = true;
  public catLoading:boolean = true;
  public serviceTypeId;
  public stringConst=STRING_CONST;
  public limit = LIMIT;
  public customButtonConst=CUSTOM_BUTTON_CONST;
  public category;

  public serviceTypeForm: FormGroup<IServiceTypeForm> = new FormGroup({
    categoryId: new FormControl("", [
      Validators.required,
    ]),
    name: new FormControl("", [
      Validators.required,
      Validators.maxLength(LIMIT.MAX_NAME_LENGTH),
      Validators.minLength(LIMIT.MIN_NAME_LENGTH),
      Validators.pattern(REGEX.ALPHABET_WITH_DIGITS)
     
    ]),
  });
  constructor(
    private _toastService:ToastService,
    private _categoryService:RequestManagementService,
    private dialogRef: MatDialogRef<AddEditTypeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  )  {
    this.dialogRef._containerInstance._config.width = "480px";
    this.dialogRef._containerInstance._config.autoFocus = false;
  }

  onNoClick(value = false): void {
    this.dialogRef.close(value);
  }
  async ngOnInit(): Promise<void> {
    this.serviceTypeId = this.data?.element?._id
    if(this.serviceTypeId){
      await this.getTypeDetails()
      if(this.data.action==='view'){
        this.serviceTypeForm.disable();
      }
    }
  }

  async getTypeDetails(): Promise<void> {
    try {
      const requestBody = {
        serviceId: this.serviceTypeId,
      };
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._categoryService.getServiceTypeDetails(requestBody)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        const categoryDetails = responseData.data;
        this.serviceTypeForm.patchValue({
          ...categoryDetails,
        });
        this.isLoading = false;
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }

  async onSubmit(): Promise<void> {
    try {
      const requestBody = { ...this.serviceTypeForm.value };
      if(this.serviceTypeId){
        requestBody['serviceId'] = this.serviceTypeId
      }
      const responseData: ApiResponse<any> = this.serviceTypeId ? await firstValueFrom(this._categoryService.editServiceType(requestBody)) : await firstValueFrom(this._categoryService.addServiceType(requestBody));
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._toastService.success(responseData.message);
        this.onNoClick(true);
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }

}
