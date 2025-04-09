import { Injectable } from "@angular/core";
import { INVALID_ID_ERROR } from "../../constants/messages";
import { Router } from "@angular/router";
import { infoKey, forgotScreen } from "../../constants/storage-keys";
import { Subscription } from "rxjs";
import { Location } from "@angular/common";
import { ToastService } from "src/app/components/toast-notification/toast.service";
import {
  MEDIA_UPLOAD,
} from "src/app/constants/api-end-point";
import { HttpService } from "../http/http.service";
import { API_STATUS } from "src/app/constants/number";
import { ApiResponse } from "src/app/constants/interface";
import { environment } from "src/environments/environment";
import { dateToMs } from "src/app/constants/helper";
import { StorageService } from "../storage/storage.service";

@Injectable({
  providedIn: "root",
})
export class CommonService {
  forForgotInfo = {} || null;
  isActiveClass = false;

  constructor(
    private _loc: Location,
    private _router: Router,
    private _toast: ToastService,
    private readonly _httpService: HttpService,
    private readonly _toastService: ToastService,
    private readonly _storage:StorageService
  ) {}

  locationBack() {
    this._loc.back();
  }

  scrollTop() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  addActiveClass() {
    setTimeout(() => {
      this.isActiveClass = true;
    }, 0);
  }

  removeActiveClass() {
    this.isActiveClass = false;
  }

  isValidId(ID: string, isNavigate = true) {
    if (/^[a-f\d]{24}$/i.test(ID)) {
      return true;
    } else {
      this._toast.error(INVALID_ID_ERROR);
      if (isNavigate) {
        this.navigate(["404"]);
      }
      return false;
    }
  }

  setOtpRelatedInfo(obj: any, screen: any) {
    switch (screen) {
      case atob(forgotScreen):
        this.setScreenInfo(forgotScreen);
        break;

      default:
        break;
    }
    localStorage.setItem(infoKey, btoa(JSON.stringify(obj)));
  }

  setScreenInfo(screenNameValue: string) {
    localStorage.setItem(screenNameValue, screenNameValue);
  }

  addClassOnBody(className: string) {
    document.body.classList.add(className);
  }

  removeClassOnBody(className: string) {
    document.body.classList.remove(className);
  }

  scrollViewById(elementId: string) {
    var myElement: any = document.getElementById(elementId);
    myElement.scrollIntoView();
  }

  getClassToRemoveAddBtn() {
    return "removeAddButton";
  }
  getClassToRemoveExportBtn() {
    return "removeExportBtn";
  }

  redirectToAnotherTab(url: string) {
    const anchor = document.createElement("a");
    anchor.setAttribute("href", url);
    anchor.setAttribute("target", "_blank");
    anchor.click();
  }

  navigate(route: any, query = {}, isMergeQuery = false) {
    this._router.navigate(route, {
      queryParams: query,
      queryParamsHandling: isMergeQuery ? "merge" : "",
    });
  }

  uploadMedia(body: any) {
    let formData: FormData = new FormData();
    formData.append("file", body);
    formData.append("type", "ADMIN");
    return this._httpService.post(MEDIA_UPLOAD, formData, true);
  }

  uploadMediaFiles(selectedFile: any) {
    return new Promise((resolve, reject) => {
      this.uploadMedia(selectedFile)
        .toPromise()
        .then(
          (response: ApiResponse | any) => {
            if (response.statusCode === API_STATUS.SUCCESS) {
              resolve(environment.s3.IMAGE_PREFIX + response.data.image);
            }
          },
          (error: any) => {
            this._toastService.error(error.message);
            reject(error);
          }
        );
    });
  }
  getCurrentTime(): string {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    // const amPm = hours >= 12 ? 'PM' : 'AM';

    // hours = hours % 12;
    // hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? "0" + minutes : minutes.toString();

    return `${hours}:${minutesStr}`;
  }

  encryption(value: any): any {
    if ((value || "") === "" || value === undefined || value === null)
      return null;
    try {
      return btoa(value);
    } catch (err) {
      return null;
    }
  }

  decryption(value: any): any {
    if ((value || "") === "" || value === undefined || value === null)
      return null;
    try {
      return atob(value);
    } catch (err) {
      return null;
    }
  }

  changeDateFormat(obj: any) {
    for (const prop in obj) {
      switch (prop) {
        case "fromDate":
        case "requestedFrom":
        case "validityFrom":
        case "startDate":
          obj[prop] = dateToMs(obj[prop]);
          break;
        case "toDate":
        case "validityTo":
        case "requestedTo":
        case "endDate":
          obj[prop] = dateToMs(obj[prop], true);
          break;
        default:
          break;
      }
    }
    return obj;
  }
      /**
   * @RETURN_PERMISSION_DATA
   */
  getPermissionByModuleId(moduleId: string) {
    if (this._storage.profileDetail.permission?.length > 0) {
      for (
        let index = 0;
        index < this._storage.profileDetail.permission?.length;
        index++
      ) {
        if (
          moduleId == this._storage.profileDetail.permission[index].moduleId
        ) {
          return this._storage.profileDetail.permission[index];
        }
      }
    } else {
      return {};
    }
  }
  /**
   * @UNSUBSCRIPTION Unsubscribe all subscriptions to avoid memory leak
   */
  unsubscribe(subscriptions: Subscription[]) {
    subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  mapMedia(mediaArr: Array<any>) {
    
    let imageArray = [];
    let videoArray = [];
    mediaArr?.forEach((ele) => {
      ele.mediaType.includes('image')
        ? imageArray.push({ ...ele, image: ele.media, thumbImage: ele.media })
        : videoArray.push({
            ...ele,
            video: ele.media,
            posterImage: ele.thumbUrl,
          });
    });
    return { imageArray, videoArray };
  }
}
