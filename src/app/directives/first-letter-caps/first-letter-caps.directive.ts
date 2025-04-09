import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appFirstLetterCaps]",
  standalone: true,
})
export class FirstLetterCapsDirective {
  constructor(private el: ElementRef) {}

  @HostListener("input", ["$event"]) onInputChange() {
    const input = this.el.nativeElement as HTMLInputElement;
    const value = input.value;

    if (value.length > 0) {
      input.value = value.charAt(0).toUpperCase() + value.slice(1);
    }
  }
}
