import { Directive, ElementRef, EventEmitter, Input, Output, Host, Self, Optional, AfterViewInit, OnDestroy } from '@angular/core';
import { MatAutocomplete } from '@angular/material/autocomplete';
import { Observable, fromEvent, of, Subject, merge, combineLatest } from 'rxjs';
import { map, startWith, switchMap, tap, debounceTime, filter, scan, withLatestFrom, mergeMap, takeUntil, takeWhile, distinctUntilChanged, skipUntil, exhaustMap, endWith } from 'rxjs/operators';

export interface IAutoCompleteScrollEvent {
  autoComplete: MatAutocomplete;
  scrollEvent: Event;
}

@Directive({
  selector: 'mat-autocomplete[optionsScroll]',
  standalone:true
})
export class OptionsScrollDirective implements OnDestroy {

  @Input() thresholdPercent = .95;
  @Output('optionsScroll') scroll = new EventEmitter<IAutoCompleteScrollEvent>();
  _onDestroy = new Subject();

  constructor(public autoComplete: MatAutocomplete) {
    this.autoComplete.opened.pipe(
      tap(() => {
        // Note: When autocomplete raises opened, panel is not yet created (by Overlay)
        // Note: The panel will be available on next tick
        // Note: The panel wil NOT open if there are no options to display
        setTimeout(() => {
          // Note: remove listner just for safety, in case the close event is skipped.
          this.removeScrollEventListener();
          this.autoComplete?.panel?.nativeElement
            .addEventListener('scroll', this.onScroll.bind(this))
        });
      }),
      takeUntil(this._onDestroy)).subscribe();

    this.autoComplete.closed.pipe(
      tap(() => this.removeScrollEventListener()),
      takeUntil(this._onDestroy)).subscribe();
  }

  private removeScrollEventListener() {
    this.autoComplete?.panel?.nativeElement
      .removeEventListener('scroll', this.onScroll);
  }

  ngOnDestroy() {
    this._onDestroy.next('');
    this._onDestroy.complete();

    this.removeScrollEventListener();
  }

  onScroll(event: Event) {

    if (this.thresholdPercent === undefined) {
      this.scroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
    } else {
     const threshold = this.thresholdPercent * 100 * (<HTMLInputElement>event.target).scrollHeight / 100;
      const current = (<HTMLInputElement>event.target).scrollTop + (<HTMLInputElement>event.target).clientHeight;
      if (current > threshold) {
        this.scroll.next({ autoComplete: this.autoComplete, scrollEvent: event });
      }
    }
  }
}
