import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoaderService } from './loader.service';
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit, OnDestroy {
  show = true;
  private _subLoader!: Subscription;

  constructor(public loader: LoaderService) {}

  ngOnInit() {
    this._subLoader = this.loader.loaderState.subscribe(
      (showState: boolean) => {
        setTimeout(() => {
          this.show = showState;
        }, 5);
      }
    );
  }

  ngOnDestroy() {
    if (this._subLoader) {
      this._subLoader.unsubscribe();
    }
  }
}
