import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[alphaNumeric]',
  standalone: true
})
export class AlphaNumericDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: any) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^a-zA-Z0-9]/g, '');
    if (initialValue !== this.el.nativeElement.value) {
      event.stopPropagation();
    }
  }

}
