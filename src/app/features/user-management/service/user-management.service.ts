import { Injectable } from '@angular/core';
import { ACTION_USER_API, ADD_USER_API, EDIT_USER_API, USER_DETAIL_API, USERS_API, USERS_LISTING } from 'src/app/constants/api-end-point';
import { USER_TYPES } from 'src/app/constants/constant';
import { HttpService } from 'src/app/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  public userTableType = 'user-list';
  constructor(private _http: HttpService) {}
  getUserList(body) {
    return this._http.get(USERS_LISTING, body);
  }
  getUserDetail(param) {
    return this._http.get(USER_DETAIL_API, param);
  }
  updateUserStatus(param) {
    return this._http.post(ACTION_USER_API, param);
  }
  addUser(param) {
    return this._http.post(ADD_USER_API, param);
  }
  editUser(param) {
    return this._http.put(EDIT_USER_API, param);
  }
}
