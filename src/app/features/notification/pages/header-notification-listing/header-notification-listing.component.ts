import { Component } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { BreadcrumbService } from 'src/app/components/breadcrumb/breadcrumb.service';
import { DataLoaderComponent } from 'src/app/components/data-loader/data-loader.component';
import { NotificationCardComponent } from 'src/app/components/notification-card/notification-card.component';
import { ResultNotFoundComponent } from 'src/app/components/result-not-found/result-not-found.component';
import { ToastService } from 'src/app/components/toast-notification/toast.service';
import { StorageService } from 'src/app/services/storage/storage.service';
import { NotificationService } from '../../_services/notification.service';
import { Pagination } from 'src/app/constants/pagination';
import { BC_NOTIFICATION } from 'src/app/constants/breadcrumb-routes';
import { ApiResponse } from 'src/app/constants/interface';
import { firstValueFrom } from 'rxjs';
import { API_STATUS } from 'src/app/constants/number';

@Component({
  selector: 'app-header-notification-listing',
  standalone: true,
  imports: [NotificationCardComponent, ResultNotFoundComponent, DataLoaderComponent, InfiniteScrollModule],
  templateUrl: './header-notification-listing.component.html',
  styleUrl: './header-notification-listing.component.scss'
})
export class HeaderNotificationListingComponent extends Pagination {
  public apiInProgess: boolean = true;
  public notificationList: Array<any> = [];
  currentPage: number = 1;
  constructor(
    private readonly _toastService: ToastService,
    private readonly _storageService: StorageService,
    private readonly _breadcrumbService: BreadcrumbService,
    private readonly _notificationService: NotificationService,
  ){
    super();
    this._breadcrumbService.setBreadcrumb(BC_NOTIFICATION);
    this.getNotificationList();
  }

    async getNotificationList(): Promise<void> {
      this.pageNo = this.currentPage;
      const params = {
        ...this.validPageOptions
      };
      delete params['sortBy'];
      delete params['sortOrder'];
      try {
        const responseData: ApiResponse<any> = await firstValueFrom(this._notificationService.getReceivedNotificationList(params));
        if (responseData.statusCode === API_STATUS.SUCCESS) {
          this.notificationList = [...this.notificationList, ...responseData.data];
          this.nextHit = responseData.nextHit;
          this.apiInProgess = false;
          this.updateReadCount(responseData['notificationCount']);
        }
      } catch (error) {
        this._toastService.error(error.message);
      }
    }

    onScroll() {
      if (this.currentPage < this.nextHit) {
        this.currentPage = this.nextHit;
        this.apiInProgess = true;
        this.getNotificationList();
      }
    }

    async updateReadCount(notificationCount: number) {
      const unReadNotificationIds = this.notificationList.map(noti => !noti.isRead ? noti._id : undefined).filter(id => id !== undefined);
      if (unReadNotificationIds.length) {
        this._storageService.profileDetail.notificationCount  =  this._storageService.profileDetail.notificationCount - unReadNotificationIds.length;
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
