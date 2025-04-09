import { Pipe, PipeTransform } from '@angular/core';
import { REQUEST_STATUS_TYPE } from 'src/app/constants/constant';

@Pipe({
  name: 'requestStatus',
  standalone: true
})
export class RequestStatusPipe implements PipeTransform {

  transform(value: any): any {
      switch (value) {
        case REQUEST_STATUS_TYPE.ACCEPT:
          return 'Accepted';
        case REQUEST_STATUS_TYPE.REJECT:
          return 'Rejected';
        case REQUEST_STATUS_TYPE.BID_AGAIN:
          return 'Bid again';
        default:
          return '-';
      }
    };

}
