import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { ACCOUNT, LOGIN, PROFILE, PROFILE_DETAILS } from '../../../constants/routes';
import { MODULE_ID_OF } from '../../../constants/messages';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root'
})
export class ViewPermissionGuard implements CanActivate {
  constructor(
    private _router: Router,
    private _storage: StorageService,
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const profileData = this._storage.profileDetail;
    if (profileData.userType == "ADMIN") {
      return true;
    }
    if ((profileData.userType == "SUB_ADMIN") && profileData.isProfileComplete) {
      this._router.navigate([`${ACCOUNT}/${LOGIN}`])
      return true;
    }
    if (route.data['moduleId'] != MODULE_ID_OF.ADMIN_PROFILE) {
      if (profileData.permission.length == 0) {
        this._router.navigate([PROFILE_DETAILS.fullUrl]);
        return false;
      }
      const permission = profileData.permission.find(item => item.moduleId == route.data['moduleId']);
      if (!permission) {
        this._router.navigate([PROFILE_DETAILS.fullUrl]);
        return false;
      }
      if (permission.edit || permission.view) {
        return true;
      } else {
        this._router.navigate([PROFILE_DETAILS.fullUrl]);
        return false;
      }
    } else {
      return true
    }
  }
  
}
