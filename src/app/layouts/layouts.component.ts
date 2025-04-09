import { Component } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { CommonModule, ViewportScroller } from "@angular/common";
import { Event, NavigationEnd, Router, RouterOutlet } from "@angular/router";
import { BreadcrumbComponent } from "../components/breadcrumb/breadcrumb.component";
const MODULES = [
  HeaderComponent,
  RouterOutlet,
  SidebarComponent,
  BreadcrumbComponent,
];
@Component({
  selector: "app-layouts",
  standalone: true,
  imports: [CommonModule, ...MODULES],
  templateUrl: "./layouts.component.html",
  styleUrl: "./layouts.component.scss",
})
export class LayoutsComponent {
  isCmsActive: boolean = false;
  isHideBox: boolean = false;
  constructor(private _router: Router, 
    private viewportScroller: ViewportScroller
  ){
    this._router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.isCmsActive = this._router.url.includes('cms-management');
        this.isHideBox = this._router.url.includes('report-and-analytics') || this._router.url.includes('dashboard');
      //  this.viewportScroller.scrollToPosition([0, 0]);
      }
    });
  }
}
