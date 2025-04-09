import { Component, Inject, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "src/app/components/confirmation-modal/confirmation-modal.component";
import { UploadImgComponent } from "src/app/components/upload-img/upload-img.component";
import { DataLoaderComponent } from "src/app/components/data-loader/data-loader.component";
import { StorageService } from "src/app/services/storage/storage.service";
import { ButtonComponent } from "src/app/components/button/button.component";
@Component({
  selector: "app-upload-image",
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatTooltipModule,
    UploadImgComponent,
    DataLoaderComponent,
    ButtonComponent,
  ],
  templateUrl: "./upload-image.component.html",
  styleUrls: ["./upload-image.component.scss"],
})
export class UploadImageComponent implements OnInit {
  show: boolean = false;
  constructor(
    private dialogRef: MatDialogRef<ConfirmationModalComponent>,
    public storage: StorageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}
  ngOnInit() {
    
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }
  async getSelectedFile(selectedFile) {
    
    this.data = selectedFile;
  }
  onLoad() {
    this.show = false;
  }
  onLoaderStateChange(isLoading: boolean) {
    this.show = isLoading; 
  }
  async confirm() {
    if (!this.data || !this.data.realFile?.name) {
      return;
    }else{
      this.addProfileImage(); 
    }
  }
  async addProfileImage() {
      this.dialogRef.close(this.data);
  }
  removeImage() {
    this.data = {removeImage: true};
    this.addProfileImage();
  }
}
