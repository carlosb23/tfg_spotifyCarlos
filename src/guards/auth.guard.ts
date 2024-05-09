import { inject } from '@angular/core';
import { CanActivateFn, Router} from '@angular/router';
import { SpotifyService } from '../service/spotify.service';


export const auth: CanActivateFn = () => {
  const router = inject(Router);
  const spotifyService = inject(SpotifyService);

  const Usuarionoreconocido = () => {
    // Verificar si localStorage está disponible
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    router.navigate(['/login']);
    return false;
  }

  // Verificar si localStorage está disponible
  if (typeof localStorage !== 'undefined') {
    const token = localStorage.getItem('token');
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