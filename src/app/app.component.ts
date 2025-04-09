import { AfterViewInit, Component, OnInit } from "@angular/core";
import { CommonModule, ViewportScroller } from "@angular/common";
import { Event, NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { ToastNotificationComponent } from "./components/toast-notification/toast-notification.component";
import { LoaderComponent } from "./components/loader/loader.component";
import { registerLocaleData } from '@angular/common';
import localeDa from '@angular/common/locales/da';
import { MessagingService } from "./services/messaging/messaging.service";
import { StorageService } from "./services/storage/storage.service";
import { SocketService } from "./services/socket/socket.service";

registerLocaleData(localeDa, 'da-DK');
@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    LoaderComponent,
    ToastNotificationComponent,
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements AfterViewInit {
  title = "cobuild";
  constructor(
    private router: Router,
    private viewportScroller: ViewportScroller,
    private readonly _messagingService: MessagingService, 
    private readonly _storageService: StorageService,
    private readonly _socketService: SocketService,
  ) {}

  ngAfterViewInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          let element = document.getElementById("main-content");
          if (element) {
            // element.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            // this.viewportScroller.scrollToPosition([0, 0]);
          }
        }, 200);
      }
    });
    if(this._storageService.token) {
      this._messagingService.checkNotificationPermission();
      this._messagingService.requestPermission();
      this._socketService.connectToServer(this._storageService.token);
    }
  }
}
