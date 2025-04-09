import { Injectable } from '@angular/core';
import { CONTENT_TYPES } from '../../../constants/constant';
import { HttpService } from '../../../services/http/http.service';
import { STATIC_CONTENT, STATIC_CONTENT_FAQ_LIST, STATIC_CONTENT_FAQS } from '../../../constants/api-end-point'
import { IFaqs } from '../../../constants/interface';

@Injectable({
  providedIn: 'root'
})
export class CmsService {

  currentTab = CONTENT_TYPES.PRIVACY_POLICY;
  faqData:IFaqs;
  public cmsType: string;

  constructor(private _http: HttpService) { }

  getCmsContents(params) {
    return this._http.get(STATIC_CONTENT, params);
  }

  updateCmsContent(payload) {
    return this._http.put(STATIC_CONTENT, payload);
  }

  getfaqList(params) {
    return this._http.get(STATIC_CONTENT_FAQ_LIST,params);
  }

  getfaqDetails(params) {
    return this._http.get(STATIC_CONTENT_FAQS,params);
  }

  addFaq(payload){
    return this._http.post(STATIC_CONTENT_FAQS,payload);
  }

  updateFaq(payload){
    return this._http.put(STATIC_CONTENT_FAQS,payload);
  }

  deleteFaq(id){
    return this._http.delete(STATIC_CONTENT_FAQS,id);
  }
}
