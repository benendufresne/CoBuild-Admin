import { Component, Inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from "@angular/material/dialog";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatTooltipModule } from "@angular/material/tooltip";

@Component({
  selector: "app-confirmation-modal",
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: "./confirmation-modal.component.html",
  styleUrls: ["./confirmation-modal.component.scss"],
})
export class ConfirmationModalComponent {
  constructor(
    private dialogRef: MatDialogRef<ConfirmationModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef._containerInstance._config.width = "480px";
    this.dialogRef._containerInstance._config.autoFocus = false;
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  confirm() {
    this.dialogRef.close(true);
  }
}
