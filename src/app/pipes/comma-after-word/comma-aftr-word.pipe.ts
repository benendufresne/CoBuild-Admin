import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commaAftrWord',
  standalone: true
})
export class CommaAftrWordPipe implements PipeTransform {

  transform(value: any[], key?: string): string {
    if (!Array.isArray(value) || value.length === 0) {
      return '-';
    }

    if (key) {
      const returnValue = value.map(item => item[key]);
      return returnValue.join(', ');
    } else {
      return value.join(', ');
    }
  } 

}
