import { Directive, ElementRef, Renderer2, Input, ViewContainerRef, ComponentRef, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { DataLoaderComponent } from '../components/data-loader/data-loader.component';

@Directive({
  selector: '[appImgLoader]',
  standalone:true
})
export class ImgLoaderDirective implements AfterViewInit {
  @Input() loaderClass: string = 'loader'; 
  @Input() lazy: boolean = false;         
  private loaderComponentRef: ComponentRef<DataLoaderComponent>;
  private observer: IntersectionObserver;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private viewContainerRef: ViewContainerRef,
    private cdr:ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    if (this.lazy) {
      this.setupLazyLoading();
    } else {
      this.loadImage(); 
    }
  }

  private setupLazyLoading() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage();
          this.observer.disconnect(); 
        }
      });
    });

    this.observer.observe(this.el.nativeElement);
  }

  private loadImage() {
    this.showLoader();

    this.renderer.setStyle(this.el.nativeElement, 'display', 'none');

    this.renderer.listen(this.el.nativeElement, 'load', () => this.onLoad());
    this.renderer.listen(this.el.nativeElement, 'error', () => this.onError());
  }

  private showLoader() {
    // setTimeout(() => {
    this.loaderComponentRef = this.viewContainerRef.createComponent(DataLoaderComponent);
      this.loaderComponentRef.instance.cssClasses = this.loaderClass;
      this.cdr.detectChanges();
    // },10);
  }

  private hideLoader() {
    if (this.loaderComponentRef) {
      this.loaderComponentRef.destroy(); 
    }
  }

  private onLoad() {
    this.hideLoader(); 
    this.renderer.setStyle(this.el.nativeElement, 'display', 'block'); 
  }

  private onError() {
    this.hideLoader();
  }
}
