import { Pipe, PipeTransform } from '@angular/core';
import { ACCOUNT_TYPE_ENUM, ADMIN_TYPE } from 'src/app/constants/constant';

@Pipe({
  name: 'userType',
  standalone: true
})
export class UserTypePipe implements PipeTransform {
  transform(value: any, forCss?: any): any {
      switch (value) {
        case ADMIN_TYPE.SUPER_ADMIN:
          return 'Super Admin';
        case ADMIN_TYPE.SUB_ADMIN:
          return 'Sub Admin';
        default:
          return '-';
      }
  }

}
