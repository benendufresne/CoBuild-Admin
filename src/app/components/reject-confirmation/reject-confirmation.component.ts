import { CommonModule } from "@angular/common";
import { Component, HostListener, Inject } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { IRejectForm } from "src/app/constants/interface";
import { ButtonComponent } from "../button/button.component";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { LIMIT, REGEX } from "src/app/constants/validators";
import { STRING_CONST } from "src/app/constants/string";
import { ErrorMessagePipe } from "src/app/pipes/error-message/error-message.pipe";
import { NoLeadingSpaceDirective } from "src/app/directives/no-leading-space/no-leading-space.directive";

@Component({
  selector: "app-reject-confirmation",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    ButtonComponent,
    ErrorMessagePipe,
    NoLeadingSpaceDirective,
  ],
  templateUrl: "./reject-confirmation.component.html",
  styleUrl: "./reject-confirmation.component.scss",
})
export class RejectConfirmationComponent {
  public limit = LIMIT;
  public stringConst = STRING_CONST;
  public rejectForm: FormGroup<IRejectForm> = new FormGroup({
    message: new FormControl("", [
      Validators.required,
      Validators.minLength(LIMIT.MIN_ADDRESS_LENGTH),
      Validators.maxLength(LIMIT.MAX_DES_LENGTH),
    ]),
  });
  public customButtonConst = CUSTOM_BUTTON_CONST;
  constructor(
    private dialogRef: MatDialogRef<RejectConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef._containerInstance._config.width = "640px";
    this.dialogRef._containerInstance._config.autoFocus = false;
    
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  confirm() {
    const messageControl = this.rejectForm.get('message');
    if (typeof messageControl.value === 'string') {
      const trimmedMessage = messageControl.value.trim();
      messageControl.setValue(trimmedMessage);
    }
    
    this.dialogRef.close(this.rejectForm);
  }
}
