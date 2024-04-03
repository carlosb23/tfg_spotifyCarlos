import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private username: any = null;
  constructor() {
    if (sessionStorage.getItem('username')) {
      this.username = JSON.parse(sessionStorage.getItem('username') || 'null');
    }
  }

  iniciarSesion(username: any) {
    this.username = username;
    sessionStorage.setItem('username', JSON.stringify(this.username));
  }

  finalizarSesion() {
    this.username = null;
    sessionStorage.removeItem('username');
  }

  obtenerusername() {
    return this.username;
  }

  estaLogueado() {
    return this.username != null;
  }
}
