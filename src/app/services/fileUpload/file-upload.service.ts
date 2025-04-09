import {
  HttpBackend,
  HttpClient,
  HttpHeaders,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { LoaderService } from "src/app/components/loader/loader.service";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  private _apiUrl: string;
  httpClient: HttpClient;
  constructor(
    private http: HttpClient,
    httpHandler: HttpBackend,
    private loaderService: LoaderService
  ) {
    this._apiUrl = environment.API_BASE_PATH;
    this.httpClient = new HttpClient(httpHandler);
  }
  generatePresignedUrl(logNamespace, fileType, loader = true) {
    if (loader) {
      this.loaderService.show();
    }
    let getheaders = new HttpHeaders().set("Accept", "application/json");
    let params = new HttpParams()
      .set("filename", logNamespace)
      .set("fileType", fileType);
    return this.http.get<any>(`${this._apiUrl}api/v1/admin/preSignedUrl?`, {
      params: params,
      headers: getheaders,
    });
  }
  async uploadFile(fileUploadUrl, contentType, file, loader = true) {
    const headers = new HttpHeaders({
      "Content-Type": contentType,
      Anonymous: "S3",
    });
  
    const req = new HttpRequest("PUT", fileUploadUrl, file, {
      headers: headers,
    });
  
    if (loader) {
      this.loaderService.show();
    }
  
    try {
      const data = await this.httpClient.request(req).toPromise();
      
      if (data instanceof HttpResponse) {
        // Additional logic if needed
        this.loaderService.hide(); 

      }
  
      return data;
    } catch (error) {
      // Handle errors here
      throw error; // Re-throw the error if necessary
    } finally {
      if (loader) {
        this.loaderService.hide(); // Hide the loader in the finally block
      }
    }
  }
}
