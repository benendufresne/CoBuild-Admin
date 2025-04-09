import { Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { timeAgoFun } from 'src/app/constants/helper';
import { INCIDENTS_DAMAGE_DETAILS, VIEW_MANAGEMENT } from 'src/app/constants/routes';
import { CommonService } from 'src/app/services/common/common.service';
import { StorageService } from 'src/app/services/storage/storage.service';

@Component({
  selector: 'app-notification-card',
  standalone: true,
  imports: [],
  templateUrl: './notification-card.component.html',
  styleUrl: './notification-card.component.scss'
})
export class NotificationCardComponent {
  @Input() notificationDetails: any;
  public timeAgoFun = timeAgoFun;

  constructor(private readonly _router: Router,
    private readonly _commonService: CommonService,
    public _storageService: StorageService,
    private readonly _matDialog: MatDialog
  ) { }

  //****** Redirect to detail page on the basis of type ******/
  onRedirectionLink(): void {
    if (this.notificationDetails.details) {
      this._matDialog.closeAll();
      switch (this.notificationDetails?.type) {
        case 'NEW_DAMAGE_INCIDENT':
          this._router.navigate([INCIDENTS_DAMAGE_DETAILS.fullUrl, this._commonService.encryption(this.notificationDetails.details.reportId)]);
          break;
        case 'NEW_ESTIMATE_REQUEST':
          this._router.navigate([VIEW_MANAGEMENT.fullUrl, this._commonService.encryption(this.notificationDetails.details.requestId)]);
          break;
      }
    }
  }

}
