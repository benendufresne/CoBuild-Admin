import { Pipe, PipeTransform } from '@angular/core';
import { NOTIFICATION_USER_TYPE } from 'src/app/constants/constant';

@Pipe({
  name: 'notificationType',
  standalone: true
})
export class NotificationTypePipe implements PipeTransform {
  transform(value: any): any {
      switch (value) {
        case NOTIFICATION_USER_TYPE.ALL:
          return 'All';
        case NOTIFICATION_USER_TYPE.ANDROID:
          return 'Android';
        case NOTIFICATION_USER_TYPE.IOS:
          return 'iOS';
        default:
          return '-';
      }
    };
}
