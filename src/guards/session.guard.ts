import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../service/session.service';
import { inject } from '@angular/core';

export const sessionGuard: CanActivateFn = (route, state) => {
  if(inject(SessionService).estaLogueado()){
    return true;
  }
  inject(Router).navigate(['/login']);
    return true;
};
