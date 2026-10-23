import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    // withComponentInputBinding() passes route params (:topicId) and query params (?tab=) to component inputs.
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(),
  ],
};
