import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { StorageService } from '../../storage/storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _storage: StorageService) {}

  authorization(basic = false) {
    const token = this._storage.token;
    const auth: any = {
    'Authorization': token && !basic ? "Bearer " + token : 'Basic ' + btoa(`${'cobuild'}:${'cobuild@123'}`),
    "Api_key": environment.API_KEY,
    'platform':"" + this._storage.deviceDetail(3),
    'language': "en",
    };
    return auth;
  }
}
