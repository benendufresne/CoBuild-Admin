import { Injectable } from '@angular/core';
import { ROLES_API, ROLES_LIST_API } from 'src/app/constants/api-end-point';
import { HttpService } from 'src/app/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  constructor(private _http: HttpService) { }
  getRoleList(body){
    return this._http.get(ROLES_LIST_API,body)
  }
  AddRole(body){
    return this._http.post(ROLES_API,body)
  }
  EditRole(body){
    return this._http.put(ROLES_API,body)
  }
  getRoleDetail(param){
    return this._http.get(ROLES_API,param)
  }
}
