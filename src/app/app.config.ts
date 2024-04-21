import { ApplicationConfig, NgModule } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { ParteIzquierdaComponent } from './components/parte-izquierda/parte-izquierda.component';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), 
    provideClientHydration(),
    provideHttpClient(withFetch())]
};