import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { IbreadcrumbRoute } from '../../constants/interface';

@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  
  data = new BehaviorSubject<Array<IbreadcrumbRoute>>([]);
  
  constructor() { }

  setBreadcrumb(route: Array<IbreadcrumbRoute>) {
    this.data.next(route);
  }
}
