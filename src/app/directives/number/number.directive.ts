import { Directive, OnInit, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumber]',
  standalone: true,
})
export class NumberDirective implements OnInit {
  @Input() isMobileNumber = false;
  @Input() isPercentage = false;
  @Input() isMinMax = false;
  @Input() formValue = '0';

  constructor() { }

  ngOnInit() { }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (
      [46, 8, 9, 27, 13].indexOf(e.keyCode) !== -1 ||
      (e.keyCode === 65 && e.ctrlKey === true) || // Allow: Ctrl+A
      (e.keyCode === 67 && e.ctrlKey === true) || // Allow: Ctrl+C
      // (e.keyCode === 86 && e.ctrlKey === true) || // Allow: Ctrl+V
      (e.keyCode === 88 && e.ctrlKey === true) || // Allow: Ctrl+X
      (e.keyCode === 65 && e.metaKey === true) || // Cmd+A (Mac)
      (e.keyCode === 67 && e.metaKey === true) || // Cmd+C (Mac)
      (e.keyCode === 86 && e.metaKey === true) || // Cmd+V (Mac)
      (e.keyCode === 88 && e.metaKey === true) || // Cmd+X (Mac)
      (e.keyCode >= 35 && e.keyCode <= 39)
    ) {
      return;
    }
    if (this.isMobileNumber && (e.keyCode === 86 && e.ctrlKey === true)) {
      return;  // Allow: Ctrl+V
    }
    if (this.isPercentage && !this.isMobileNumber && (e.keyCode === 189)) {
      return;  // Allow: Negative sign
    }
    if (this.isMinMax) {
      const val = Number(this.formValue + e.key);
      if (val<1 || val>100) {
        e.preventDefault();
      }
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
      e.preventDefault();
    }

  }
}
