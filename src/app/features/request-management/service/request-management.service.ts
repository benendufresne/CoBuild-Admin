import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import {
  REQUEST_API,
  REQUESTS_API,
  SERVICE_CATEGORY_API,
  SERVICE_CATEGORY_DROPDOWN_API,
  SERVICE_CATEGORY_LIST_API,
  SERVICE_TYPE_API,
  SERVICE_TYPE_DROPDOWN_LIST_API,
  SERVICE_TYPE_LIST_API,
} from "src/app/constants/api-end-point";
import { IsTableFiltered } from "src/app/constants/interface";
import { HttpService } from "src/app/services/http/http.service";

@Injectable({
  providedIn: "root",
})
export class RequestManagementService {
  category: any[] = [];
  private isRequestTableFiltered: BehaviorSubject<IsTableFiltered> =
    new BehaviorSubject<IsTableFiltered>({
      isFiltered: false,
      listName: "",
      values: {},
    });
  private isServiceTypeTableFiltered: BehaviorSubject<IsTableFiltered> =
    new BehaviorSubject<IsTableFiltered>({
      isFiltered: false,
      listName: "",
      values: {},
    });
  private searchCategoryKey: BehaviorSubject<any> = new BehaviorSubject<any>(
    ""
  );
  private searchTypeKey: BehaviorSubject<any> = new BehaviorSubject<any>("");
  private searchRequestKey: BehaviorSubject<any> = new BehaviorSubject<any>("");

  constructor(private readonly _http: HttpService) {}
  getCategoryDropdownList(serviceType) {
    return this._http.get(SERVICE_CATEGORY_DROPDOWN_API,serviceType);
  }
  getCategoryList(body) {
    return this._http.get(SERVICE_CATEGORY_LIST_API, body);
  }
  addCategory(param) {
    return this._http.post(SERVICE_CATEGORY_API, param);
  }
  getCategoryDetails(param) {
    return this._http.get(SERVICE_CATEGORY_API, param);
  }
  editCategory(param) {
    return this._http.put(SERVICE_CATEGORY_API, param);
  }
  getServiceTypeList(body) {
    return this._http.get(SERVICE_TYPE_LIST_API, body);
  }
  getServiceTypeDropdownList(body) {
    return this._http.get(SERVICE_TYPE_DROPDOWN_LIST_API, body);
  }
  addServiceType(param) {
    return this._http.post(SERVICE_TYPE_API, param);
  }
  getServiceTypeDetails(param) {
    return this._http.get(SERVICE_TYPE_API, param);
  }
  editServiceType(param) {
    return this._http.put(SERVICE_TYPE_API, param);
  }
  getRequestList(body) {
    return this._http.get(REQUEST_API, body);
  }
  getRequestDetails(param) {
    return this._http.get(REQUESTS_API, param);
  }
  editRequest(param) {
    return this._http.put(REQUESTS_API, param);
  }
  setCategory(data) {
    this.category = data;
  }
  getCategory() {
    return this.category;
  }
  getIsRequestTableFiltered(): Observable<IsTableFiltered> {
    return this.isRequestTableFiltered.asObservable();
  }

  setIsRequestTableFiltered(value: IsTableFiltered): void {
    this.isRequestTableFiltered.next(value);
  }
  getIsServiceTypeTableFiltered(): Observable<IsTableFiltered> {
    return this.isServiceTypeTableFiltered.asObservable();
  }

  setIsServiceTypeTableFiltered(value: IsTableFiltered): void {
    this.isServiceTypeTableFiltered.next(value);
  }
  setSearchCategoryData(value): void {
    this.searchCategoryKey.next(value);
  }
  getSearchCategoryData(): Observable<any> {
    return this.searchCategoryKey.asObservable();
  }
  setSearchTypeData(value): void {
    this.searchTypeKey.next(value);
  }
  getSearchTypeData(): Observable<any> {
    return this.searchTypeKey.asObservable();
  }
  setSearchRequestData(value): void {
    this.searchRequestKey.next(value);
  }
  getSearchRequestData(): Observable<any> {
    return this.searchRequestKey.asObservable();
  }
}
