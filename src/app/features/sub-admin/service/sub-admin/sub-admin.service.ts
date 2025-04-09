import { Injectable } from "@angular/core";
import {
  SUBADMIN_API,
  SUBADMIN_LIST_API,
  SUBADMIN_ROLES_LIST_API,
} from "src/app/constants/api-end-point";
import { HttpService } from "src/app/services/http/http.service";

@Injectable({
  providedIn: "root",
})
export class SubAdminService {
  constructor(private _http: HttpService) {}
  getSubAdminList(body) {
    return this._http.get(SUBADMIN_LIST_API, body);
  }
  AddSubAdmin(body) {
    return this._http.post(SUBADMIN_API, body);
  }
  EditSubAdmin(body) {
    return this._http.put(SUBADMIN_API, body);
  }
  getSubAdminDetail(param) {
    return this._http.get(SUBADMIN_API, param);
  }
  getRoleList() {
    return this._http.get(SUBADMIN_ROLES_LIST_API);
  }
}
