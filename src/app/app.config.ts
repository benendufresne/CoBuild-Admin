import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  BrowserAnimationsModule,
  provideAnimations,
} from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import {
  DEFAULT_TIMEOUT,
  InterceptorInterceptor,
} from './services/interceptor/interceptor.interceptor';
import { ROUTES } from './app.routes';
// Import the necessary modules from AngularFire
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { environment } from 'src/environments/environment';
export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptorInterceptor,
      multi: true,
    },
    { provide: DEFAULT_TIMEOUT, useValue: 30000 },
    provideRouter(ROUTES),
    importProvidersFrom([BrowserAnimationsModule, HttpClientModule]),
        // Initialize Firebase App
        provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
        // Provide Firebase Messaging
        provideMessaging(() => getMessaging())
  ],
};
