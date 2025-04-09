import { Injectable } from "@angular/core";
import {
  CHANGE_PASSWORD_API,
  MEDIA_UPLOAD,
  PROFILE
} from "src/app/constants/api-end-point";
import { HttpService } from "src/app/services/http/http.service";

@Injectable({
  providedIn: "root",
})
export class ProfileService {
  constructor(private _http: HttpService) {}
  updateProfileInfo(body: any) {
    return this._http.put(PROFILE, body);
  }
  changePassword(body: any) {
    return this._http.post(CHANGE_PASSWORD_API, body);
  }
  mediaUpload(body: any) {
    return this._http.post(MEDIA_UPLOAD, body);
  }
}
