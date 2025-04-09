import { Injectable } from '@angular/core';
import { GET_DASHBOARD_API} from 'src/app/constants/api-end-point';
import { HttpService } from 'src/app/services/http/http.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor(private readonly _httpService: HttpService) {}

  getDashboard(body) {
    return this._httpService.get(GET_DASHBOARD_API, body);
  }

}
