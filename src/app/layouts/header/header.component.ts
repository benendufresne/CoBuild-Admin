import { Component, Renderer2 } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router, RouterModule } from "@angular/router";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { ConfirmationModalComponent } from "../../components/confirmation-modal/confirmation-modal.component";
import {
  TITLE_CONFIRMATION,
  MSSG_CONFIRMATION,
} from "../../constants/messages";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { LazyImageComponent } from "../../components/lazy-image/lazy-image.component";
import { AbsoluteRoutePipe } from "../../pipes/absolute-route/absolute-route.pipe";
import { StorageService } from "../../services/storage/storage.service";
import { AccountService } from "../../features/accounts/_services/account.service";
import { BreadcrumbComponent } from "../../components/breadcrumb/breadcrumb.component";
import { ApiResponse } from "src/app/constants/interface";
import { firstValueFrom } from "rxjs";
import { API_STATUS } from "src/app/constants/number";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import { CHANGE_PASSWORD } from "src/app/constants/routes";
import { NotificationQuickViewComponent } from "src/app/features/notification/pages/notification-quick-view/notification-quick-view.component";

@Component({
  selector: "app-header",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatDialogModule,
    MatButtonModule,
    MatTooltipModule,
    LazyImageComponent,
    AbsoluteRoutePipe,
    BreadcrumbComponent,
  ],
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent {
  flag: boolean = true;
  constructor(
    private _dialog: MatDialog,
    public _storageService: StorageService,
    private readonly _accountService: AccountService,
    private readonly _toasterService: ToastService,
    private readonly renderer: Renderer2,
    private readonly _router: Router
  ) {}
  logoutHandler() {
    const dialog = this._dialog.open(ConfirmationModalComponent, {
      panelClass: "account-popup",
      width: "480px",
      data: {
        title: TITLE_CONFIRMATION("Logout"),
        message: MSSG_CONFIRMATION("logout from the platform"),
        btn2: "Cancel",
        btn1: "Log out",
      },
    });
    dialog.afterClosed().subscribe((result) => {
      if (result) {
        this.confirmLogout();
      }
    });
  }

  async confirmLogout() {
    try {
      const responseData: ApiResponse = await firstValueFrom(
        this._accountService.logOut()
      );
      if (responseData.statusCode === API_STATUS.SUCCESS) {
        this._storageService.logout();
        this._toasterService.success(responseData.message);
      }
    } catch (error) {
      this._toasterService.success(error.message);
    }
  }
  navigateToChangePassword() {
    this._router.navigate([CHANGE_PASSWORD.path]);
  }

  sidebarCollaped() {
    if (this.flag === true) {
      this.renderer.addClass(document.body, "collapsed");
      this.renderer.addClass(
        document.body,
        "showing-icons-on-collapse"
      ); /* For showing icons on sidebar collapsed*/
      this.flag = !this.flag;
    } else {
      this.renderer.removeClass(document.body, "collapsed");
      this.renderer.removeClass(
        document.body,
        "showing-icons-on-collapse"
      ); /* For showing icons on sidebar collapsed*/
      this.flag = !this.flag;
    }
  }
  onNotification(): void {
    this._dialog.open(NotificationQuickViewComponent, {
      position: {
        top: "75px",
        right: "210px",
      },
      panelClass: "custom-container",
    });
  }
}
