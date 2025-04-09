import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { SafePipe } from "../../../../pipes/safe/safe.pipe";
import { DataLoaderComponent } from "../../../../components/data-loader/data-loader.component";
import { QuillEditorComponent, QuillModule } from "ngx-quill";
import { Subscription, firstValueFrom } from "rxjs";
import { CommonService } from "../../../../services/common/common.service";
import { CmsService } from "../../service/cms.service";
import { ToastService } from "../../../../components/toast-notification/toast.service";
import { MatFormFieldModule } from "@angular/material/form-field";
import { ErrorMessagePipe } from "../../../../pipes/error-message/error-message.pipe";
import { EDITOR_COMMON_MESSAGES } from "../../../../constants/messages";
import {
  ApiResponse,
  IEditorForm,
  IStaticContent,
} from "../../../../constants/interface";
import { STRING_CONST } from "../../../../constants/string";
import { BreadcrumbService } from "../../../../components/breadcrumb/breadcrumb.service";

import { API_STATUS } from "src/app/constants/number";
import { ButtonComponent } from "src/app/components/button/button.component";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { CONTENT_TYPES } from "src/app/constants/constant";
import { LIMIT, REGEX } from "src/app/constants/validators";
import { BC_EDIT_ABOUT_US_CUSTOMER, BC_EDIT_FAQS_CUSTOMER, BC_EDIT_PRIVACY_POLICY_CUSTOMER, BC_EDIT_TERMS_CONDITION_CUSTOMER } from "src/app/constants/breadcrumb-routes";

const MODULES = [
  MatButtonModule,
  QuillModule,
  ReactiveFormsModule,
  SafePipe,
  DataLoaderComponent,
  MatFormFieldModule,
  ErrorMessagePipe,
  ButtonComponent,
];

@Component({
  selector: "app-cms-editor",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./cms-editor.component.html",
  styleUrls: ["./cms-editor.component.scss"],
})
export class CmsEditorComponent {
  cmsForm: FormGroup<IEditorForm>;
  contentData: IStaticContent;
  isApiCallInProgress = false;
  showBtn = true;
  subscriptions: Subscription[] = [];
  stringConst = STRING_CONST;
  public customButtonConst = CUSTOM_BUTTON_CONST;
  public limit = LIMIT;
  @Input() editorData: any;
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @ViewChild("quillEditor") quillEditor: QuillEditorComponent;
  answerLength;
  plainTextContent;
  exceedMaxLength;
  constructor(
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _common: CommonService,
    private _cms: CmsService,
    private _bc: BreadcrumbService
  ) {}
  ngOnInit() {
    this.createForm();
    this.getContent();
    this.setBreadcrumb();
  }
  createForm() {
    this.cmsForm = this._fb.group({
      data: [
        "",
        [Validators.required, Validators.minLength(LIMIT.MIN_QUESTION_LENGTH)],
      ],
    });
  }
  get f() {
    return this.cmsForm.controls;
  }

  setBreadcrumb() {
    switch (
      this._cms.currentTab
    ) {
  
      case CONTENT_TYPES.ABOUT_US:
        this._bc.setBreadcrumb(BC_EDIT_ABOUT_US_CUSTOMER);
        break;
      case CONTENT_TYPES.PRIVACY_POLICY:
        this._bc.setBreadcrumb(BC_EDIT_PRIVACY_POLICY_CUSTOMER);
        break;
      case CONTENT_TYPES.TERMS_CONDITIONS:
        this._bc.setBreadcrumb(BC_EDIT_TERMS_CONDITION_CUSTOMER);
        break;
      case CONTENT_TYPES.FAQS:
        this._bc.setBreadcrumb(BC_EDIT_FAQS_CUSTOMER);
        break;
    }
  }
  getQuillEditorLength() {
    const editorContent = this.quillEditor?.quillEditor?.getText();
    this.plainTextContent = editorContent?.replace(/\n/g, "");
    this.answerLength = this.plainTextContent?.length || 0;

    this.exceedMaxLength = this.answerLength > this.limit?.MAX_EDITOR_LENGTH;

    this.cmsForm
      .get("answer")
      ?.setValidators(
        this.exceedMaxLength ? Validators.nullValidator : Validators.required
      );
    this.cmsForm.get("answer")?.updateValueAndValidity();
  }
  getContent() {
    this.isApiCallInProgress = true;
    let params = {
      type: this._cms.currentTab,
    };
    this.subscriptions.push(
      this._cms.getCmsContents(params).subscribe({
        next: (res: ApiResponse<IStaticContent>) => {
          this.isApiCallInProgress = false;
          if (res && res.data) {
            this.contentData = res.data;
            this.f[this.stringConst.DATA].patchValue(this.contentData.data);
          }
        },
        error: () => (this.isApiCallInProgress = false),
      })
    );
  }

  async updateContent() {
    this.getQuillEditorLength();
    if (this.answerLength <= 0 || this.answerLength < 3) {
      this._toast.error("Please enter minimum 3 characters.");
    } else if (this.exceedMaxLength) {
      this._toast.error("Content exceeds the 5000-character limit.");
    } else if (!this.plainTextContent || this.plainTextContent.trim() === "") {
      this._toast.error(EDITOR_COMMON_MESSAGES.CONTENT_REQ);
    } else {
      if (this.f[this.stringConst.DATA].value && this.cmsForm.valid) {
        let reqData = {
          data: this.f[this.stringConst.DATA].value.trim(),
          type: this._cms.currentTab,
        };

        try {
          const responseData: ApiResponse = await firstValueFrom(
            this._cms.updateCmsContent(reqData)
          );
          if (responseData.statusCode === API_STATUS.TWO_ZERO_TWO) {
            this._toast.success(responseData.message);
            this.navigateToContent();
          }
        } catch (error) {
          this._toast.error(error.message);
        }
      } else {
        if (!this.cmsForm.valid) {
          this._toast.error(EDITOR_COMMON_MESSAGES.CONTENT_REQ);
        }
      }
    }
  }

  onCancel() {
    if (this.subscriptions.length > 0) {
      this._common.unsubscribe(this.subscriptions);
    }
    this.navigateToContent();
  }

  navigateToContent() {
    this.edit.emit(false);
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
