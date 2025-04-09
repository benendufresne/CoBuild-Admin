import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  INCIDENT_DAMAGE_LISTING_API,
  INCIDENT_DAMAGE_VIEW_API,
} from "src/app/constants/api-end-point";
import { IsTableFiltered } from "src/app/constants/interface";
import { HttpService } from "src/app/services/http/http.service";

@Injectable({
  providedIn: "root",
})
export class DamageService {
  private isDamageTableFiltered: BehaviorSubject<IsTableFiltered> =
    new BehaviorSubject<IsTableFiltered>({
      isFiltered: false,
      listName: "",
      values: {},
    });
    private searchReportKey : BehaviorSubject<any> = new BehaviorSubject<any>('');

  constructor(private readonly _http: HttpService) {}
  getDamagesList(body) {
    return this._http.get(INCIDENT_DAMAGE_LISTING_API, body);
  }
  getDamagesDetails(body) {
    return this._http.get(INCIDENT_DAMAGE_VIEW_API, body);
  }
  editDamagesStatus(body) {
    return this._http.put(INCIDENT_DAMAGE_VIEW_API, body);
  }
  getIsDamageTableFiltered(): Observable<IsTableFiltered> {
    return this.isDamageTableFiltered.asObservable();
  }

  setIsDamageTableFiltered(value: IsTableFiltered): void {
    this.isDamageTableFiltered.next(value);
  }
  setSearchDamageData(value):void{
    this.searchReportKey.next(value);

      }
  getSearchDamageData():Observable<any>{
return this.searchReportKey.asObservable();

  }
}
