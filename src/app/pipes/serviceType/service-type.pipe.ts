import { Pipe, PipeTransform } from '@angular/core';
import { SERVICE_TYPE, SERVICE_TYPE_ARRAY } from 'src/app/constants/constant';

@Pipe({
  name: 'serviceType',
  standalone: true
})
export class ServiceTypePipe implements PipeTransform {
  transform(value: any, extraArgument?: string): any {
    switch (value) {
      case SERVICE_TYPE.CATEGORY_SERVICE:
        return SERVICE_TYPE_ARRAY[0].label;
      case SERVICE_TYPE.CABLE_CONSULTING_SERVICE:
        return SERVICE_TYPE_ARRAY[1].label;
        case SERVICE_TYPE.CUSTOM_SERVICE:
          return SERVICE_TYPE.CUSTOM_SERVICE;
      default:
        return "-";
    }
  }

}
