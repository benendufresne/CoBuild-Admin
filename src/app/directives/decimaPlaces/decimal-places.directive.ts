import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appDecimalPlaces]',
  standalone: true
})
export class DecimalPlacesDirective {

  constructor(private control: NgControl) {}

  @HostListener('input', ['$event'])
  onInputChange(event: any): void {
    const input = event.target.value;

    // Allow up to 2 decimal places
    const regex = /^\d*\,?\d{0,2}$/;

    if (!regex.test(input)) {
      const formattedInput = input.substring(0, input.length - 1);
      this.control.control?.setValue(formattedInput);
    }
  }


}
