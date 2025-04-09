import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { firstValueFrom } from "rxjs";
import { ButtonComponent } from "src/app/components/button/button.component";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import {
  BUTTON_TYPE_CONST,
  CUSTOM_BUTTON_CONST,
} from "src/app/constants/actionbutton-constant";
import { SERVICE_TYPE, SERVICE_TYPE_ARRAY } from "src/app/constants/constant";
import { ApiResponse} from "src/app/constants/interface";
import { API_STATUS } from "src/app/constants/number";
import { STRING_CONST } from "src/app/constants/string";
import { LIMIT, REGEX } from "src/app/constants/validators";
import { NoLeadingSpaceDirective } from "src/app/directives/no-leading-space/no-leading-space.directive";
import { RequestManagementService } from "src/app/features/request-management/service/request-management.service";
import { ErrorMessagePipe } from "src/app/pipes/error-message/error-message.pipe";

const MODULES = [
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  ButtonComponent,
  NoLeadingSpaceDirective,
  DataLoaderComponent,
  ErrorMessagePipe,
  MatSelectModule,
];
@Component({
  selector: "app-add-edit",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./add-edit.component.html",
  styleUrl: "./add-edit.component.scss",
})
export class AddEditComponent implements OnInit {
  public isLoading: boolean = true;
  public categoryId;
  public stringConst = STRING_CONST;
  public limit = LIMIT;
  public customButtonConst = CUSTOM_BUTTON_CONST;
  public serviceType = SERVICE_TYPE_ARRAY;
  public type = SERVICE_TYPE;
  public categoryForm!: FormGroup;
  public buttonType = BUTTON_TYPE_CONST;
  constructor(
    private _toastService: ToastService,
    private _formBuilder: FormBuilder,
    private _categoryService: RequestManagementService,
    private dialogRef: MatDialogRef<AddEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef._containerInstance._config.width = "480px";
    this.dialogRef._containerInstance._config.autoFocus = false;
    this.createForm();
  }
  createForm() {
    this.categoryForm = this._formBuilder.group({
      serviceType: ["", [Validators.required]],
      categoryName: [
        "",
        [
          Validators.required,
          Validators.maxLength(LIMIT.MAX_NAME_LENGTH),
          Validators.minLength(LIMIT.MIN_NAME_LENGTH),
          Validators.pattern(REGEX.ALPHABET_WITH_DIGITS),
        ],
      ],
      issueTypeName: [""],
      subIssueName: new FormArray([]),
    });
  }
  ngOnInit(): void {
    this.categoryId = this.data?.element?._id;
    if (this.categoryId) {
      this.getCategoryDetails();
      if (this.data.action === "view") {
        this.categoryForm.disable();
      } else if(this.data.action ==="edit"){
          this.categoryControl['serviceType'].disable();
      }
    }
  }
  get categoryControl() {
    return this.categoryForm.controls;
  }
  get subIssuesFormArray(): FormArray {
    return this.categoryForm.controls["subIssueName"] as FormArray;
  }

  onServiceTypeChange(serviceType: string): void {
    const issueTypeName = this.categoryControl["issueTypeName"];
    const subIssueName = this.categoryControl["subIssueName"];
    const categoryName = this.categoryControl["categoryName"];

    if (serviceType === this.type.CABLE_CONSULTING_SERVICE) {
      issueTypeName?.setValidators([
        Validators.required,
        Validators.maxLength(LIMIT.MAX_NAME_LENGTH),
        Validators.minLength(LIMIT.MIN_NAME_LENGTH),
        Validators.pattern(REGEX.ALPHABET_WITH_DIGITS),
      ]);
    } else {
      issueTypeName?.clearValidators();
    }

    issueTypeName?.updateValueAndValidity();

    categoryName?.setValue("");
    issueTypeName?.setValue("");
    subIssueName?.setValue([]);
  }
  createSubIssueControl() {
    return new FormControl("", [
      Validators.minLength(this.limit.MIN_NAME_LENGTH),
      Validators.pattern(REGEX.ALPHABET_WITH_DIGITS),
    ]);
  }
  addSubIssue(): void {
    this.subIssuesFormArray.push(this.createSubIssueControl());
  }

  removeSubIssue(index: number): void {
    this.subIssuesFormArray.removeAt(index);
    this.categoryForm.markAsDirty();
  }
  onNoClick(value = false): void {
    this.dialogRef.close(value);
  }

  async getCategoryDetails(): Promise<void> {
    try {
      const requestBody = {
        categoryId: this.categoryId,
      };
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._categoryService.getCategoryDetails(requestBody)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        const categoryDetails = responseData.data;
        const subIssues = categoryDetails.subIssueName || []; // Array of strings
        const subIssueFormArray = this._formBuilder.array(
          subIssues.map(
            (subIssue: string) =>
              new FormControl(subIssue, [
                Validators.minLength(this.limit.MIN_NAME_LENGTH),
                Validators.pattern(REGEX.ALPHABET_WITH_DIGITS),
              ])
          )
        );

        this.categoryForm.setControl("subIssueName", subIssueFormArray);
        this.categoryForm.patchValue({
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
      const requestBody = { ...this.categoryForm.value };
      if (this.categoryId) {
        requestBody["categoryId"] = this.categoryId;
      }
      if (requestBody["subIssueName"].length === 0) {
        delete requestBody["subIssueName"];
      }
      if (requestBody["issueTypeName"] ==='') {
        delete requestBody["issueTypeName"];
      }
      const responseData: ApiResponse<any> = this.categoryId
        ? await firstValueFrom(this._categoryService.editCategory(requestBody))
        : await firstValueFrom(this._categoryService.addCategory(requestBody));
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._toastService.success(responseData.message);
        this.onNoClick(true);
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }
}
