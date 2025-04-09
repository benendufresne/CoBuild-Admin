import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ACCOUNT } from '../../../constants/routes';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private _router: Router, private _storage: StorageService) {}

  canActivate(): Observable<any> | Promise<any> | any {
    if (this._storage.token) {
      return new Observable((observer) => {
        this._storage.getProfileDetail().then((result: any) => {
            observer.next(true);
          })
          .catch((err: any) => {
            observer.next(false);
          });
      });
    } else {
      const tree: UrlTree = this._router.parseUrl(ACCOUNT.path);
      return tree;
    }
  }
}
