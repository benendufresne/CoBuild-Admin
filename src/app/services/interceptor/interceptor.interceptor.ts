import { Injectable, InjectionToken, Inject } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { map, catchError, finalize, timeout } from 'rxjs/operators';
import { LoaderService } from 'src/app/components/loader/loader.service';
import { ToastService } from 'src/app/components/toast-notification/toast.service';
import { StorageService } from '../storage/storage.service';
import { AuthService } from './auth/auth.service';
import { INTERNAL_SERVER_ERROR, NO_INTERNET, SESSION_EXPIRED } from 'src/app/constants/messages';
import { MEDIA_UPLOAD } from 'src/app/constants/api-end-point';
import { retryWithBackOff } from 'src/app/constants/retryApiWithBackOff';
import { MatDialog } from '@angular/material/dialog';

export const DEFAULT_TIMEOUT = new InjectionToken<number>('defaultTimeout');

@Injectable()
export class InterceptorInterceptor implements HttpInterceptor {
  constructor(
    @Inject(DEFAULT_TIMEOUT) protected defaultTimeout: number,
    private _auth: AuthService,
    private _toast: ToastService,
    private _ls: LoaderService,
    private _store: StorageService,
    private _router: Router,
    private _dialog:MatDialog
  ) {}
  setAuthorizationHeader(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({ setHeaders: this._auth.authorization() });
}


intercept(
  req: HttpRequest<any>,
  next: HttpHandler
): Observable<HttpEvent<any>> {
  if (req.headers.get("Anonymous") == "S3") {
    const newHeaders = req.headers.delete("Anonymous");
    const newRequest = req.clone({ headers: newHeaders });
    return next.handle(newRequest);
  }
  const timeoutValue =
  Number(req.headers.get("timeout")) || this.defaultTimeout;
  let authReq = this.setAuthorizationHeader(req);


    return next.handle(authReq).pipe(
      timeout(timeoutValue),
      map((event: HttpEvent<any>): any => {
        if (event instanceof HttpResponse) {
          this._ls.hide();
          return event;
        }
      }),
      catchError((error: HttpErrorResponse) => {
        this.errorState(error);
        return throwError(error.error);
      }),
      finalize(() => {
        this._ls.hide();
      })
    );
}
  errorState(error: any, data?: any) {
    this._ls.hide();
    if (error.status == 0) {
      if (!navigator.onLine) {
        this._toast.error(NO_INTERNET);
      } else {
        this._toast.error(INTERNAL_SERVER_ERROR);
      }
    } else if (error.status == 401 || error.status == 500) {
      if (error?.error?.type === 'SESSION_EXPIRED') {
        this._toast.error(SESSION_EXPIRED);
      }
      this._store.logout();
      this._dialog.closeAll();
    } else if (error.status == 404) {
      this._toast.error(data ? data.message : error.error.message);
      this._router.navigate(['404']);
    } 
    // else {
    //   this._toast.error(data ? data.message : error.error.message);
    // }
  }
}
