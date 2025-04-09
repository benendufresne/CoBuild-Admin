import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appNoLeadingSpace]',
  standalone: true
})
export class NoLeadingSpaceDirective {

  constructor() { }

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    // Check if the key pressed is the space key and if it occurs at the beginning of the input value
    if (event.key === ' ' && event.target['selectionStart'] === 0) {
      event.preventDefault(); // Prevent the default behavior of the space key
    }
  }

}
