import { Injectable } from "@angular/core";
import { HttpService } from "../../../services/http/http.service";
import {
  LOGIN_API,
  LOGOUT_API,
  FORGOT_PASSWORD_API,
  RESET_PASSWORD_API,
  PROFILE,
} from "../../../constants/api-end-point";

@Injectable({
  providedIn: "root",
})
export class AccountService {
  constructor(private _http: HttpService) {}

  logIn(body: any) {
    return this._http.post(LOGIN_API, body);
  }

  logOut() {
    return this._http.post(LOGOUT_API, {});
  }

  forgotPassword(body: any) {
    return this._http.post(FORGOT_PASSWORD_API, body);
  }


  getProfile() {
    return this._http.get(PROFILE, {});
  }

  resetPassword(body: any) {
    return this._http.post(RESET_PASSWORD_API, body);
  }

}
