import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import  Aura  from '@primeuix/themes/aura';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { LoaderInterceptor } from './components/interceptors/loader.interceptor';
import { AuthInterceptor } from './components/interceptors/auth.interceptor';
import { ErrorInterceptor } from './components/interceptors/error.interceptor';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
        withInterceptors([LoaderInterceptor, AuthInterceptor, ErrorInterceptor])
    ),
    MessageService,
    providePrimeNG({
        theme: {
            preset: Aura
        }
    }),
  ]
};