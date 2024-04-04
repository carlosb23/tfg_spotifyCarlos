import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    // Verificar si el token de acceso está presente en localStorage
    if (typeof localStorage !== 'undefined') {
      // Código que accede a localStorage
      const token = localStorage.getItem('spotifyToken');
      if (token) {
        // Si el token está presente, el usuario está autenticado
        return true;
      } else {
        // Si el token no está presente, redirigir al usuario a la página de inicio de sesión
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      // Manejar el caso donde localStorage no está disponible
      console.error('localStorage is not available');
      return false;
    }
  }
}