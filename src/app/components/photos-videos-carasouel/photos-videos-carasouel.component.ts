import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { NgImageSliderComponent, NgImageSliderModule } from 'ng-image-slider';

@Component({
  selector: 'app-photos-videos-carasouel',
  standalone: true,
  imports: [NgImageSliderModule],
  templateUrl: './photos-videos-carasouel.component.html',
  styleUrl: './photos-videos-carasouel.component.scss'
})
export class PhotosVideosCarasouelComponent {
  @ViewChild('nav') slider!: NgImageSliderComponent;
  @Input() images: any
  @Input() videos: any
  @Input() videoAutoPlay: boolean = false;
  
  openPopUp:any = false

  imageObject: any = []
  
  ngOnInit() {
    this.setImages()
    // this?.setVideos()

  }


  setImages() {
    this.imageObject = this.images;
    // for (let ele in this.images) {
    //   this.imageObject.push({ image: this.images[ele],thumbImage:this.images[ele] })
    // }
  }

  setVideos() {
    this.imageObject = [...this.images, ...this?.videos];
    // for (let ele in this.videos) {
    //   this.imageObject.push({ video: this.videos[ele] })
    // }
  }

  openPOPUP() {
    this.openPopUp = true
    this.slider.ligthboxShow = true
  }

  changeVal() {
    this.openPopUp = false
  }

  imageClick(ev: any) {
    this.openPopUp = true
    this.slider.activeImageIndex = ev;
    this.slider.ligthboxShow = true
  }

  ngOnChanges(changes: SimpleChanges) {
    this.setImages();
    // this.setVideos();
  }
  
}
