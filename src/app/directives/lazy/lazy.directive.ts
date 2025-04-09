import { Directive, ElementRef, HostBinding, Input } from '@angular/core';

@Directive({
  selector: '[lazy]',
  standalone: true,
})
export class LazyDirective {
  /**
   * @SETTER_GETTER using Input & Output
   */
  _img: any;
  get src(): any {
    return this._img;
  }
  @Input() set src(value: any) {
    this._img = value;
    this.lazyLoadImage();
  }
  colors = [
    '#70929c,#846170',
    '#846170,#70929c',
    '#e6846e,#70929c',
    '#8e8485,#70929c',
    '#846170,#e6846e',
    '#70929c,#e6846e',
    '#70929c,#8e8485',
    '#8e8485,#e6846e',
    '#e6846e,#846170',
  ];
  @HostBinding('attr.src') srcAttr = null;

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.setBackgroundColor();
    this.canLazyLoad() ? this.lazyLoadImage() : this.loadImage();
  }

  private canLazyLoad() {
    return window && 'IntersectionObserver' in window;
  }

  private lazyLoadImage() {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(({ isIntersecting }) => {
        if (isIntersecting) {
          this.loadImage();
          obs.unobserve(this.el.nativeElement);
        }
      });
    });
    obs.observe(this.el.nativeElement);
  }

  private loadImage() {
    let lazyImg = new Image();
    lazyImg.src = this.src;
    lazyImg.addEventListener('load', () => {
      this.srcAttr = this.src;
    });
  }

  setBackgroundColor() {
    const color = this.colors[Math.floor(Math.random() * this.colors.length)];
    // this.el.nativeElement.style.backgroundImage = `linear-gradient(135deg,${color})`;
    // this.el.nativeElement.style.backgroundImage =
    //   'url("/assets/images/college-logo.svg")';
    // this.el.nativeElement.style.backgroundRepeat = "no-repeat";
    // this.el.nativeElement.style.backgroundSize = "500px 500px";
  }
}
