import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-view-more',
  standalone: true,
  imports: [CommonModule, MatIconModule,
    MatDialogModule,
    MatTooltipModule,],
  templateUrl: './view-more.component.html',
  styleUrls: ['./view-more.component.scss']
})
export class ViewMoreComponent {
  constructor(
    private dialogRef: MatDialogRef<ViewMoreComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dialogRef._containerInstance._config.width = "480px";
    this.dialogRef._containerInstance._config.autoFocus = false;
    
  }
  
  onNoClick(): void {
    this.dialogRef.close(false);
  }
}


