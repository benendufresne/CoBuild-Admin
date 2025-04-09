import { DASHBOARD } from './../../../constants/routes';
import { Injectable } from '@angular/core';
import { UrlTree, Router } from '@angular/router';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class LogInGuard {
  constructor(private _router: Router, private _storage: StorageService) {}

  canActivate(): boolean | UrlTree {
    if (this._storage.token) {
      const tree: UrlTree = this._router.parseUrl(DASHBOARD.path);
      return tree;
    } else {
      return true;
    }
  }
}
