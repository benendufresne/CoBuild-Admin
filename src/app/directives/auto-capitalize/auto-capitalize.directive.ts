import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appAutoCapitalize]',
  standalone: true,
})
export class AutoCapitalizeDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const inputElement = <HTMLInputElement>event.target;
    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;
    inputElement.value = inputElement.value.toUpperCase();
    inputElement.setSelectionRange(start, end);
  }

}
