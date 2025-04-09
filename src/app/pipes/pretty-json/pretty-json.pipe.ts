import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DATE_TYPES } from 'src/app/constants/messages';

@Pipe({
  name: 'prettyJson',
  standalone: true,
})
export class PrettyJsonPipe implements PipeTransform {
  transform(value: any, subKey: string, type: string): unknown {
    if (value) {
      let data = value[subKey];
      if (type === 'time') {
        return this.setDateTimeFormat(data, DATE_TYPES.DATE_WITH_TIME);
      } else {
        if (value instanceof Array) {
          return value[0][subKey];
        } else {
          return value[subKey] ? value[subKey] : '-';
        }
      }
    }
    return '-';
  }
  setDateTimeFormat(date: string | number | Date, format: string | undefined) {
    let str = new DatePipe('en-US').transform(date, format);
    return str ? str : '-';
  }
}
