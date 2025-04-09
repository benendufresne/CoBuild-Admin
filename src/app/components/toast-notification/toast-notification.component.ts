import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { ToastService } from './toast.service';
@Component({
  selector: 'app-toast-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-notification.component.html',
  styleUrls: ['./toast-notification.component.scss'],
})
export class ToastNotificationComponent implements OnInit, OnDestroy {
  open = false;
  notify: any;
  private subscription!: Subscription;

  constructor(private _toast: ToastService) {}

  ngOnInit() {
    this.subscription = this._toast.notification.subscribe((showState: any) => {
      this.notify = showState;
      this.open = true;
      setTimeout(() => {
        this.open = false;
      }, showState.time);
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
