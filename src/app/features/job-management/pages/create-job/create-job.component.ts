import { STRING_CONST } from "./../../../../constants/string";
import { CommonModule } from "@angular/common";
import {
  Component,
  OnInit,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { ActivatedRoute, Router } from "@angular/router";
import { firstValueFrom } from "rxjs";
import { BreadcrumbService } from "src/app/components/breadcrumb/breadcrumb.service";
import { ButtonComponent } from "src/app/components/button/button.component";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { BC_JOB_ADD, BC_JOB_EDIT } from "src/app/constants/breadcrumb-routes";
import { ApiResponse } from "src/app/constants/interface";
import { API_STATUS, NUMBER_CONST } from "src/app/constants/number";
import { JOB_MANAGEMENT } from "src/app/constants/routes";
import { NoLeadingSpaceDirective } from "src/app/directives/no-leading-space/no-leading-space.directive";
import { PreventKeysDirective } from "src/app/directives/prevent-keys/prevent-keys.directive";
import { ErrorMessagePipe } from "src/app/pipes/error-message/error-message.pipe";
import { JobManagementService } from "../../service/job-management.service";
import { OnlyNumberDirective } from "src/app/directives/only-number/only-number.directive";
import { LIMIT, REGEX } from "src/app/constants/validators";
import { PRIORITY_LEVEL, SERVICE_TYPE } from "src/app/constants/constant";
import { CommonService } from "src/app/services/common/common.service";
import { AddressFieldComponent } from "src/app/components/address-field/address-field.component";

const MODULES = [
  MatButtonModule,
  MatInputModule,
  MatFormFieldModule,
  FormsModule,
  ButtonComponent,
  ReactiveFormsModule,
  ErrorMessagePipe,
  DataLoaderComponent,
  MatIconModule,
  NoLeadingSpaceDirective,
  MatSelectModule,
  PreventKeysDirective,
  ErrorMessagePipe,
  OnlyNumberDirective,
  AddressFieldComponent
];
@Component({
  selector: "app-create-job",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./create-job.component.html",
  styleUrl: "./create-job.component.scss",
})
export class CreateJobComponent implements OnInit {
  public customButtonConst = CUSTOM_BUTTON_CONST;
  public dataLoading: boolean = true;
  public isLoading: boolean = true;
  public categoryLoading: boolean = true;
  public actionInProgress: boolean = false;
  public numberConst = NUMBER_CONST;
  public newAddJobForm: FormGroup<any>;
  public stringConst = STRING_CONST;
  public limit = LIMIT;
  public priorityLevel: Array<any> = PRIORITY_LEVEL;
  public category;
  private jobId;
  public type;
  constructor(
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _router: Router,
    private readonly _fb: FormBuilder,
    private readonly _toastService: ToastService,
    private readonly _jobService: JobManagementService,
    private readonly _commonService: CommonService,
    private readonly _actRoute: ActivatedRoute
  ) {}
  async ngOnInit() {
    await this.getCategory();
    if (this._actRoute.snapshot.params[STRING_CONST.JOB_ID]) {
      this.jobId = this._commonService.decryption(
        this._actRoute.snapshot.params[STRING_CONST.JOB_ID]
      );
      this.getJobDetails();
      this._breadcrumbService.setBreadcrumb(BC_JOB_EDIT);
    } else {
      this._breadcrumbService.setBreadcrumb(BC_JOB_ADD);
    }
    this.createForm();
  }
  createForm() {
    this.newAddJobForm = this._fb.group({
      title: [
        "",
        [Validators.required, Validators.minLength(LIMIT.MIN_NAME_LENGTH)],
      ],
      categoryObj: ["", [Validators.required]],
      personalName: [
        "",
        [Validators.required, Validators.minLength(LIMIT.MIN_NAME_LENGTH)],
      ],
      email: [
        "",
        [
          Validators.pattern(REGEX.EMAIL),
          Validators.maxLength(LIMIT.MAX_EMAIL_LENGTH),
        ],
      ],
      countryCode: ["+1", [Validators.required]],
      fullMobileNo: [
        "",
        [
          Validators.required,
          Validators.pattern(REGEX.MOBILE_NUMBER),
          Validators.minLength(LIMIT.MIN_MOBILE_LENGTH),
        ],
      ],
      address: ["", [Validators.required]],
      lat: ["", [Validators.required]],
      lng: ["", [Validators.required]],
      addressCompany: ["", [Validators.required]],
      latCompany: ["", [Validators.required]],
      lngCompany: ["", [Validators.required]],
      aboutCompany: ["", [Validators.minLength(LIMIT.MIN_NAME_LENGTH)]],
      priority: ["", [Validators.required]],
      procedure: ["", [Validators.minLength(LIMIT.MIN_NAME_LENGTH)]],
    });
  }
  async getJobDetails(): Promise<void> {
    try {
      const requestBody = {
        jobId: this.jobId,
      };
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._jobService.detailsJob(requestBody)
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        const jobDetails = responseData.data;
        const selectedCategory = this.category.find(
          (item) => item._id === jobDetails?.categoryId
        );
        this.newAddJobForm.patchValue({
          ...jobDetails,
          address: jobDetails?.location?.address,
          addressCompany:jobDetails?.companyLocation?.address,
          categoryObj: selectedCategory,
        });
        if (jobDetails?.location?.coordinates) {
          this.newAddJobForm.patchValue({
            lat: jobDetails?.location?.coordinates[1],
            lng: jobDetails?.location?.coordinates[0],
          });
        }
        if (jobDetails?.companyLocation?.coordinates) {
          this.newAddJobForm.patchValue({
            latCompany: jobDetails?.companyLocation?.coordinates[1],
            lngCompany: jobDetails?.companyLocation?.coordinates[0],
          });
        }
        this.dataLoading = false;
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }
  get frmCtrl() {
    return this.newAddJobForm.controls;
  }
  /****** Back To Location ******/
  backNavigation() {
    this._router.navigate([JOB_MANAGEMENT.fullUrl]);
  }

  onSelectionChange(event) {
    if (event) {
      const data = {
        categoryId: event?.value?._id,
      };
      // this.getServiceType(data);
    }
  }
  async onSubmit() {
    try {
      const requestBody = { ...this.newAddJobForm.value,
     
       };
      requestBody["location"] = {
        coordinates: [
          this.newAddJobForm.controls["lng"].value,
          this.newAddJobForm.controls["lat"].value,
        ],
        address: this.newAddJobForm.controls["address"].value,
      };
      requestBody["companyLocation"] = {
        coordinates: [
          this.newAddJobForm.controls["lngCompany"].value,
          this.newAddJobForm.controls["latCompany"].value,
        ],
        address: this.newAddJobForm.controls["addressCompany"].value,
      };
      requestBody["categoryName"] =
        this.newAddJobForm.controls["categoryObj"]?.value?.categoryName;
      requestBody["categoryId"] =
        this.newAddJobForm.controls["categoryObj"]?.value?._id;
        
      if (this.frmCtrl["email"].value === "") {
        delete requestBody["email"];
      }
      if(requestBody["aboutCompany"]===''){
        delete requestBody["aboutCompany"];

      }
      if(requestBody["procedure"]===''){
        delete requestBody["procedure"];

      }
      delete requestBody["lat"];
      delete requestBody["lng"];
      delete requestBody["address"];
      delete requestBody["latCompany"];
      delete requestBody["lngCompany"];
      delete requestBody["addressCompany"];
      delete requestBody["countryCode"];
      delete requestBody["categoryObj"];
      // delete requestBody["typeObj"];
      if (this.jobId) {
        requestBody[STRING_CONST.JOB_ID] = this.jobId;
      }
      const responseData: ApiResponse<any> = this.jobId
        ? await firstValueFrom(this._jobService.editJob(requestBody))
        : await firstValueFrom(this._jobService.createJob(requestBody));

      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._toastService.success(responseData.message);
        this.backNavigation();
      }
    } catch (error) {
      this.actionInProgress = false;
      this._toastService.error(error.message);
    }
  }
  async getCategory(): Promise<void> {
    try {
      const responseData: ApiResponse<any> = await firstValueFrom(
        this._jobService.getCategoryDropdownList({serviceType:SERVICE_TYPE.CATEGORY_SERVICE})
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this.category = responseData?.data;
        this.categoryLoading = false;
      }
    } catch (error) {
      this._toastService.error(error.message);
    }
  }
}
