import { Injectable } from '@angular/core';
import { getToken, Messaging } from '@angular/fire/messaging';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpService } from '../http/http.service';
import { environment } from 'src/environments/environment';
import { StorageService } from '../storage/storage.service';
import { PROFILE } from 'src/app/constants/api-end-point';

@Injectable({
  providedIn: 'root'
})
export class MessagingService {
  
  constructor(private readonly messaging: Messaging,
    private readonly _storageService:StorageService,
    private readonly _httpService:HttpService
  ) {}

  // Request user permission to send notifications
  async requestPermission() {
    getToken(this.messaging, { vapidKey: environment.firebaseConfig.vapidKey })
      .then(async (token) => {        
        if (token) {
          await firstValueFrom(this.saveFcmTokent({deviceToken: token}))
        } else {
          console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.error('An error occurred while retrieving token. ', err);
      });
  }

  saveFcmTokent(reqBody) {
    return this._httpService.put(PROFILE, reqBody);
  }

  checkNotificationPermission() {
    if (!('Notification' in window)) {
      // Browser doesn't support notifications
      alert('This browser does not support desktop notification');
      return;
    }

    if (Notification.permission === 'denied') {
      // Notifications are blocked
      alert('You have blocked notifications for this site. Please enable them in your browser settings if you wish to receive notifications.');
      return;
    }

    if (Notification.permission === 'default') {
      // Ask for permission
      this.requestNotificationPermission();
    } else if (Notification.permission === 'granted') {
      // Notifications are already granted
      console.log('Notifications are enabled');
    }
  }

  requestNotificationPermission() {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        // Now you can subscribe the user to notifications
      } else if (permission === 'denied') {
        console.warn('Notification permission denied.');
        alert('Notifications have been disabled. Please enable them in your browser settings if you change your mind.');
      }
    });
  }
  
}
