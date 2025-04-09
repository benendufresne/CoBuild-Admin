import { Injectable } from '@angular/core';
import { HttpService } from '../../../services/http/http.service';
import {  NOTIFICATION_API, NOTIFICATION_DETAIL_API, NOTIFICATION_LIST_API, NOTIFICATION_READ_UPDATE_API, RESEND_NOTIFICATION_API } from 'src/app/constants/api-end-point';
// import { NOTIFICATION } from 'src/app/constants/api-end-point';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private readonly _http: HttpService) { }

  getNotificationListing(param) {
    return this._http.get(NOTIFICATION_API, param);
  }
  getNotificationDetails(param) {
    return this._http.get(NOTIFICATION_DETAIL_API, param);
  }
  editNotification(param) {
    return this._http.put(NOTIFICATION_DETAIL_API, param);
  }
  resendNotification(param) {
    return this._http.post(RESEND_NOTIFICATION_API, param);
  }
  addNotification(params) {
    return this._http.post(NOTIFICATION_DETAIL_API, params);
  }
  updateReadStatus(requestbody) {
    return this._http.put(NOTIFICATION_READ_UPDATE_API,requestbody);
  }
  getReceivedNotificationList(param){
    return this._http.get(NOTIFICATION_LIST_API, param);

  }
}