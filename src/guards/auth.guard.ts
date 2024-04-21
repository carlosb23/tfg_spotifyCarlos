import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { SpotifyService } from '../service/spotify.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  
  constructor(private router: Router,
    private spotifyService: SpotifyService
  ) { 
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const token = localStorage.getItem('token');

    if (!token) {
      return this.Usuarionoreconocido();
    }

    return new Promise((resolve) => {
      const usuariocreado = this.spotifyService.inicializarUsuario();
      if (usuariocreado) {
        resolve(true);
      } else {
        resolve(this.Usuarionoreconocido());
      }
    })
  }

  Usuarionoreconocido() {
    localStorage.clear();
    this.router.navigate(['/login']);
    return false;
  }

}