import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberLimit]',
  standalone: true,
})
export class NumberLimitDirective {
  @Input()
  public minimum!: number;

  @Input()
  public maximum!: number;

  constructor(private ref: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const maxLength = this.ref.nativeElement.maxLength;
    const input: HTMLInputElement = event.target as HTMLInputElement;
    if (input.value.length > maxLength) {
      input.value = input.value.slice(0, maxLength);
    }
  }
}
