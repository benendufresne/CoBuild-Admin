import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NotificationCardComponent } from 'src/app/components/notification-card/notification-card.component';
import { NotificationService } from '../../_services/notification.service';
import { ApiResponse } from 'src/app/constants/interface';
import { firstValueFrom } from 'rxjs';
import { API_STATUS, NUMBER_CONST } from 'src/app/constants/number';
import { ToastService } from 'src/app/components/toast-notification/toast.service';
import { Pagination } from 'src/app/constants/pagination';
import { ResultNotFoundComponent } from 'src/app/components/result-not-found/result-not-found.component';
import { DataLoaderComponent } from 'src/app/components/data-loader/data-loader.component';
import { StorageService } from 'src/app/services/storage/storage.service';
import { NOTIFICATIONS } from 'src/app/constants/routes';

@Component({
  selector: 'app-notification-quick-view',
  standalone: true,
  imports: [NotificationCardComponent, ResultNotFoundComponent, DataLoaderComponent],
  templateUrl: './notification-quick-view.component.html',
  styleUrl: './notification-quick-view.component.scss'
})
export class NotificationQuickViewComponent extends Pagination {
  public apiInProgess: boolean = true;
  public notificationList: Array<any> = [];
  public totalNotificationCount: number = 0;
  public numberConst = NUMBER_CONST;
  constructor(
    private dialogRef: MatDialogRef<NotificationQuickViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private readonly _router: Router,
    private readonly _toastService: ToastService,
    private readonly _storageService: StorageService,
    private readonly _notificationService: NotificationService
  ){
    super();
    this.getNotificationList();
  }

    onClose(): void {
      this.dialogRef.close();
    }

    onViewAllNotifications(): void {
      this.onClose();
      this._router.navigate([NOTIFICATIONS.fullUrl]);
    }

    async getNotificationList(): Promise<void> {
      const params = {
        ...this.validPageOptions,
      };
      delete params['sortBy']
      try {
        const responseData: ApiResponse<any> = await firstValueFrom(this._notificationService.getReceivedNotificationList(params));
        if (responseData.statusCode === API_STATUS.SUCCESS) {
          this.notificationList = responseData?.data?.slice(0,2);
          this.updateReadCount(responseData['notificationCount']);
          this.totalNotificationCount = responseData['total'];
          this.apiInProgess = false;
        }
      } catch (error) {
        this._toastService.error(error.message);
      }
    }

    async updateReadCount(notificationCount: number) {
      const unReadNotificationIds = this.notificationList.map(noti => !noti.isRead ? noti._id : undefined).filter(id => id !== undefined);
      if (unReadNotificationIds.length) {
        try {
          const responseData: ApiResponse<any> = await firstValueFrom(this._notificationService.updateReadStatus({notificationIds:unReadNotificationIds}));
          if (responseData.statusCode === API_STATUS.SUCCESS) {
            this._storageService.profileDetail.notificationCount = (notificationCount - unReadNotificationIds.length) || 0;
          }
        } catch (error) {
          this._toastService.error(error.message);
        }
      }
    }
}
