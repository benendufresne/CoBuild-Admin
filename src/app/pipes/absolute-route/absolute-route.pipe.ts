import { Pipe, PipeTransform } from '@angular/core';
import * as routes from '../../constants/routes';

@Pipe({
  name: 'absoluteRoute',
  standalone: true,
})
export class AbsoluteRoutePipe implements PipeTransform {
  transform(route: string) {
    try {
      return routes[route as keyof typeof routes].fullUrl;
    } catch (error) {
      return '';
    }
  }
}
