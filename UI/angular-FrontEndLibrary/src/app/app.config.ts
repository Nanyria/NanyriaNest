import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import {
  provideHttpClient,
  withInterceptors,
  withXhr,
} from '@angular/common/http';
import { routes } from './app.routes';
import { AuthInterceptor } from './Services/auth.inceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withXhr(), withInterceptors([AuthInterceptor])),
  ],
};
