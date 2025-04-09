import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[oneSpaceBtwWords]',
  standalone: true
})
export class OneSpaceBtwWordsDirective {

  constructor() { }

  @HostListener('keypress', ['$event'])
  onKeyDown(e: any) {
    let input = e.target;
    let val = input.value;
    let end = input.selectionEnd;
    let startPos = event.['currentTarget'].selectionStart;
    if (event['which'] === 32 && startPos == 0) {
      event.preventDefault();
    } else {
      if (e.keyCode == 32 && (val[end - 1] == " " || val[end] == " ")) {
        e.preventDefault();
        return false;
      }
    }
  }

}
