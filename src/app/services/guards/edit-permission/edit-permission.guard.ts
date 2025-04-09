import { PROFILE_DETAILS } from './../../../constants/routes';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot } from '@angular/router';
import { StorageService } from '../../storage/storage.service';
import { ADMIN_TYPES } from 'src/app/constants/roles';

@Injectable({
  providedIn: 'root',
})
export class EditPermissionGuard {
  constructor(private _router: Router, private readonly _storage: StorageService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    this._storage.getProfileDetail().then((res: any) => {
      const profileData = res;
      if (!profileData.userType) {
        this._storage.logout();
        return false;
      }
      if (profileData.userType === ADMIN_TYPES.ADMIN) {
        return true;
      } else {
      //   if (MODULE_ACCESS[route.data['moduleId']].edit) {
      //     return true
      //   } else {
      //     this._router.navigate([PROFILE_DETAILS.fullUrl]);
      //     return false;
      //   }
      }
    });
   }
}
