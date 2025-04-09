import { Component, Inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DataLoaderComponent } from '../../../../../components/data-loader/data-loader.component';
import { QuillEditorComponent, QuillModule } from "ngx-quill";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CmsService } from '../../../service/cms.service';
import { ToastService } from '../../../../../components/toast-notification/toast.service';
import { Subscription } from 'rxjs';
import { ApiResponse, IFaqForm } from '../../../../../constants/interface';
import { STRING_CONST } from '../../../../../constants/string';
import { BreadcrumbService } from '../../../../../components/breadcrumb/breadcrumb.service';
import { CommonService } from 'src/app/services/common/common.service';
import { LIMIT } from 'src/app/constants/validators';
import { ErrorMessagePipe } from 'src/app/pipes/error-message/error-message.pipe';
import { ButtonComponent } from 'src/app/components/button/button.component';

const MODULES = [
  MatButtonModule,
  QuillModule,
  ReactiveFormsModule,
  DataLoaderComponent,
  MatFormFieldModule,
  MatIconModule,
  MatTooltipModule,
  MatInputModule,
  ErrorMessagePipe,
  ButtonComponent
];

@Component({
  selector: 'app-add-edit-faqs',
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: './add-edit-faqs.component.html',
  styleUrls: ['./add-edit-faqs.component.scss']
})
export class AddEditFaqsComponent {

  isApiCallInProgress = false;
  showBtn = true;
  faqForm: FormGroup<IFaqForm>;
  edit: boolean = false;
  subscriptions: Subscription[] = [];
  stringConst = STRING_CONST;
  limit = LIMIT
  questionLength
  modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],

      [{ list: "ordered" }, { list: "bullet" }],
    ],
  };
  @ViewChild("quillEditor") quillEditor: QuillEditorComponent;
  @ViewChild("quillEditor1") quillEditor1: QuillEditorComponent;

  answerLength;
  plainTextContent;
  plainQuesTextContent;
  exceedMaxLength;
  exceedMaxQuesLength;

  constructor(
    public _dialogRef: MatDialogRef<AddEditFaqsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private _fb: FormBuilder,
    private _toast: ToastService,
    private _cms: CmsService,
    private readonly _commonService: CommonService,
    private _bc:BreadcrumbService
  ) { }
  ngOnInit(): void {
    this.isApiCallInProgress = true;
    this.createForm();
    if (this.data && this.data._id) {
      this.edit = true;
      this.fetchCategoryDetails();
    } else {
      setTimeout(() => {
        this.isApiCallInProgress = false;
      }, 0);
    }
  }

  createForm() {
    this.faqForm = this._fb.group({
      question: ["", [Validators.required, Validators.minLength(LIMIT.MIN_QUESTION_LENGTH),Validators.maxLength(LIMIT.MAX_QUESTION_LENGTH)]],
      answer: ["", [Validators.required, Validators.minLength(LIMIT.MIN_QUESTION_LENGTH),Validators.maxLength(LIMIT.MAX_ANSWER_LENGTH)]],
    });
  }
  get f() {
    return this.faqForm.controls;
  }

  fetchCategoryDetails() {
    this.faqForm.patchValue(this.data);
    this.isApiCallInProgress = false;
  }
  getQuillEditorLength(type: 'answer' | 'question') {
    const editor = type === 'answer' ? this.quillEditor : this.quillEditor1;
    const content = editor?.quillEditor?.getText()?.replace(/\n/g, '') || '';
    const length = content.length;
    const maxLength = type === 'answer' ? LIMIT.MAX_ANSWER_LENGTH : LIMIT.MAX_QUESTION_LENGTH;
  
    if (type === 'answer') {
      this.plainTextContent = content;
      this.answerLength = length;
      this.exceedMaxLength = length > maxLength;
    } else {
      this.plainQuesTextContent = content;
      this.questionLength = length;
      this.exceedMaxQuesLength = length > maxLength;
    }
  }
  
  updateContentHandler() {
    this.resetErrors(); // Clear existing errors before validation
    if (this.questionLength < 3) {
      this.f['question'].setErrors({ minFAQ: true });
    } else if (this.plainQuesTextContent?.trim() === '') {
      this.f['question'].setErrors({ noSpace: true });
    }
  
    if (this.answerLength < 3) {
      this.f['answer'].setErrors({ minFAQ: true });
    } else if (this.plainTextContent?.trim() === '') {
      this.f['answer'].setErrors({ noSpace: true });
    }
  
    if (!this.faqForm.valid) {
      Object.keys(this.f).forEach((controlName) => {
        this.f[controlName].markAsTouched();
      });
      return;
    }
  
    let faqData = {
      question: this.f[this.stringConst.QUESTION].value,
      answer: this.f[this.stringConst.ANSWER].value,
    }
    if (this.data && this.data[this.stringConst.ID]) {
      this.updateFaq(faqData);
    } else {
      faqData['type'] = this._cms.cmsType
      this.addFaq(faqData);
    }
  }
  resetErrors() {
    this.f['question'].setErrors(null);
    this.f['answer'].setErrors(null);
  }

  addFaq(payload) {
    this._cms.addFaq(payload).subscribe({
      next: (res: ApiResponse) => {
        this._toast.success(res.message);
        this.closePopup(true);
      },
      error: (err) => {
        this._toast.error(err.message)
        this.closePopup(false);
      }
    });
  }

  updateFaq(faqData) {
    let reqData ={
...faqData,
faqId:this.data._id
    } ;
    this._cms.updateFaq(reqData).subscribe({
      next: (res: ApiResponse) => {
        this._toast.success(res.message);
        this.closePopup(true);
      },
      error: (err) => {
        this._toast.error(err.message)
        this.closePopup(false);
      }
    });
  }

  closePopup(res: boolean = false) {
    this._dialogRef.close(res);
  }

}
