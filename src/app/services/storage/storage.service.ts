import { Injectable, Injector } from '@angular/core';
import { PROFILE } from '../../constants/api-end-point';
import { Router } from '@angular/router';
import { DASHBOARD } from '../../constants/routes';
import { HttpService } from '../http/http.service';
import { MessagingService } from '../messaging/messaging.service';
import { SocketService } from '../socket/socket.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  profileDetail: any = null;
  getCategoryDropdownList:any;
  firebaseToken:string;
  private messagingService!: MessagingService;
  private socketService!: SocketService;
  constructor(private _router: Router, private _http: HttpService,  private injector: Injector ) {
    
  }
  setUserToken(token: any) {
    sessionStorage.setItem('session_token', token)
  }
  get token() {
    return  sessionStorage.getItem('session_token')
  }
  getSocketService(): SocketService {
    if (!this.socketService) {
      this.socketService = this.injector.get(SocketService);
    }
    return this.socketService;
  }
  private getMessagingService(): MessagingService {
    if (!this.messagingService) {
      this.messagingService = this.injector.get(MessagingService); // Get MessagingService only when needed
    }
    return this.messagingService;
  }
  getProfileDetail(showLoader = true) {
    return new Promise((resolve, reject) => {
      if (this.profileDetail) {
        resolve(this.profileDetail);
      } else {
        this._http.get(PROFILE, '', showLoader).toPromise()
          .then((response: any) => {
              this.profileDetail = response.data;
              // this.setModuleAccess();
              resolve(this.profileDetail);
            },
            (error) => {
              reject(error);
            }
          );
      }
    });
  }
  logout() {
    this.getSocketService().disconnectToSocket();
    sessionStorage.removeItem('session_token');
    setTimeout(() => {
      this.profileDetail = null;
    }, 1000); // this is used for avoid random reflection on side bar if logout
    this._router.navigate(['/']);
  }

  async loginSuccessfully(response: any, responeFrom = "") {
    this.setUserToken(response.data.accessToken);
    await this.getProfileDetail();
    this.getMessagingService().requestPermission();
    this._router.navigate([DASHBOARD]);

  }
  deviceDetail(info?: number): string {
    /*---1=device_token, 2=deviceId, 3=platform---*/
    switch (info) {
      case 1:
        let deviceToken = this.attachDeviceToken();
        return deviceToken;
      case 2:
        let deviceId = this.randomDeviceId();
        return deviceId;
      case 3:
        return '3';
      default:
        return this.getTimeZone().toString();
    }
  }

  attachDeviceToken() {
    return (Date.now() + Math.floor(Math.random() * 1000000) + 1).toString();
  }

  randomDeviceId() {
    return window.navigator.userAgent.replace(/\D+/g, '');
  }

  getTimeZone() {
    let date = new Date();
    let offset = date.getTimezoneOffset() * -1;
    return offset * 60 * 1000;
  }
}
