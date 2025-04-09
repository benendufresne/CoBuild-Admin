import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

const MODULES = [
  MatButtonModule,
]

@Component({
  selector: 'app-sucess',
  standalone: true,
  imports: [CommonModule,...MODULES],
  templateUrl: './sucess.component.html',
  styleUrls: ['./sucess.component.scss']
})
export class SucessComponent {

  constructor(
    private dialogRef: MatDialogRef<SucessComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.dialogRef._containerInstance._config.width = "480px";
    this.dialogRef._containerInstance._config.autoFocus = false;
  }

  onClose(): void {
    this.dialogRef.close(true);
  }

}
