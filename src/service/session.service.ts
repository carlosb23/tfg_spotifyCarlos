import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private username: any = null;

  constructor() {
    this.loadUsername();
  }

  private loadUsername() {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('username')) {
      this.username = JSON.parse(localStorage.getItem('username') || 'null');
    }
  }

  iniciarSesion(username: any) {
    this.username = username;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('username', JSON.stringify(this.username));
    }
  }

  finalizarSesion() {
    this.username = null;
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('username');
    }
  }

  obtenerUsername() {
    return this.username;
  }

  estaLogueado() {
    return this.username != null;
  }
}
