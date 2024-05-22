import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { SpotifyService } from '../service/spotify.service';


export const auth: CanActivateFn = () => {
  const router = inject(Router);
  const spotifyService = inject(SpotifyService);

  const Usuarionoreconocido = () => {
    // Verificar si sessionStorage está disponible
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear();
    }
    router.navigate(['/login']);
    return false;
  }

  // Verificar si sessionStorage está disponible
  if (typeof sessionStorage !== 'undefined') {
    const token = sessionStorage.getItem('token');
    if (!token) {
      return Usuarionoreconocido();
    }
  }
  
  // Asegúrate de devolver un valor booleano en todos los casos
  const usuariocreado = spotifyService.inicializarUsuario();
  if(usuariocreado)
    return true;
  else
    return Usuarionoreconocido();

};