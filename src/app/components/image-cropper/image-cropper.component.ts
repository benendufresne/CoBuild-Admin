import { CommonModule } from "@angular/common";
import { Component, Inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from "@angular/material/dialog";
import {
  ImageCroppedEvent,
  ImageCropperModule,
  ImageTransform,
  LoadedImage,
} from "ngx-image-cropper";
import { ButtonComponent } from "../button/button.component";
import { CUSTOM_BUTTON_CONST } from "src/app/constants/actionbutton-constant";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
@Component({
  selector: "app-image-cropper",
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    ImageCropperModule,
    ButtonComponent,
    MatProgressSpinnerModule,
  ],
  templateUrl: "./image-cropper.component.html",
  styleUrl: "./image-cropper.component.scss",
})
export class ImageCropper {
  imageChangedEvent: any = "";
  croppedImage: any = "";
  fileName = "";
  isImageLoaded = false;
  maintainAspectRatio = false;
  canvasRotation = 0;
  aspectRatio: number;
  transform: ImageTransform = {};
  showCropper = false;
  cropReady = false;
  croperConfig = {
    roundCropper: false,
  };
  customButtonConst = CUSTOM_BUTTON_CONST;

  constructor(
    private dialogRef: MatDialogRef<ImageCropper>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.imageChangedEvent = this.data.image;
    this.croperConfig.roundCropper = this.data.roundCropper;
    this.aspectRatio = this.data.aspectRatio;
    this.fileName = this.data.image.target.files[0].name;
    this.maintainAspectRatio = this.data.maintainAspectRatio || false;
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  imageLoaded(image: LoadedImage) {
    this.showCropper = true;
    this.isImageLoaded = true;
  }

  cropperReady(e: any) {
    this.cropReady = true;
  }

  cancel() {
    let dataObject = {
      save: false,
      file: null,
    };
    this.dialogRef.close(dataObject);
  }

  saveImage() {
    let file = this.dataURLtoFile(this.croppedImage, this.fileName);
    let dataObject = {
      save: true,
      file: file,
    };
    this.dialogRef.close(dataObject);
  }

  dataURLtoFile(dataurl: any, filename: string) {
    filename = this.generateUniqueFileName(4, filename);
    var arr = dataurl.split(","),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    let file = {
      file: new File([u8arr], filename, { type: mime }),
      dataurl: dataurl,
    };

    return file;
  }

  generateUniqueFileName(length: number, fileName: string) {
    let result = "";
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }

    var position = fileName.length > 1 ? 6 : 1;
    var output = [
      fileName.slice(0, position),
      result,
      fileName.slice(position),
    ].join("");
    return output;
  }

  ngOnDestroy(): void {
    this.imageChangedEvent = null;
  }
}
