import { HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  DEFAULT_TIMEOUT,
  InterceptorInterceptor,
} from './interceptor.interceptor';

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: InterceptorInterceptor, multi: true },
  { provide: DEFAULT_TIMEOUT, useValue: 30000 },
];
