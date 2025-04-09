import { Injectable } from "@angular/core";
import {
  CREATE_JOBS_API,
  IMPORT_JOBS_API,
  JOB_ID_JOBS_API,
  JOBS_API,
  SCHEDULE_JOBS_API,
  SERVICE_CATEGORY_DROPDOWN_API,
  SERVICE_TYPE_DROPDOWN_LIST_API,
} from "src/app/constants/api-end-point";
import { HttpService } from "src/app/services/http/http.service";

@Injectable({
  providedIn: "root",
})
export class JobManagementService {
  constructor(private _http: HttpService) {}
  getJobsList(body) {
    return this._http.get(JOBS_API, body);
  }
  createJob(body) {
    return this._http.post(CREATE_JOBS_API, body);
  }
  editJob(body) {
    return this._http.put(CREATE_JOBS_API, body);
  }
  detailsJob(body) {
    return this._http.get(CREATE_JOBS_API, body);
  }
  getJobDropdownList() {
    return this._http.get(JOB_ID_JOBS_API);
  }
  scheduleJob(body) {
    return this._http.post(SCHEDULE_JOBS_API, body);
  }
  importJob(body) {
    return this._http.post(IMPORT_JOBS_API, body);
  }
  getServiceTypeDropdownList(body) {
    return this._http.get(SERVICE_TYPE_DROPDOWN_LIST_API, body);
  }
  getCategoryDropdownList(body) {
    return this._http.get(SERVICE_CATEGORY_DROPDOWN_API,body);
  }
}
