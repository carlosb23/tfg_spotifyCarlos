
import { Injectable } from '@angular/core';
import Spotify from 'spotify-web-api-js';
import { IUsuario } from '../app/Interfaces/IUsuario';
import { SpotifyPlaylistParaPlaylist, SpotifyUserParaUsuario } from '../app/common/spotifyHelper';
import { IPlaylist } from '../app/Interfaces/IPlaylist';
import { Console } from 'console';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  spotifyApi: Spotify.SpotifyWebApiJs = null;
  usuario: IUsuario;
  private usuarioSubject = new BehaviorSubject<IUsuario>(null);
  usuarioObservable = this.usuarioSubject.asObservable();

  constructor(private router: Router) {
    this.spotifyApi = new Spotify();
  }

  async inicializarUsuario() {
    if (!!this.usuario)
      return true;

    if (typeof localStorage === 'undefined') {
      return false;
    }

    const token = localStorage.getItem('token');

    if (!token)
      return false;


    try {
      this.definirAccessToken(token);
      await this.obterSpotifyUsuario();
      return !!this.usuario;
    } catch (ex) {
      return false;
    }
  }

  async obterSpotifyUsuario() {
    try {
      const userInfo = await this.spotifyApi.getMe();
      console.log('Información de usuario obtenida:', userInfo);
      const usuario = SpotifyUserParaUsuario(userInfo);
      console.log('Usuario convertido:', usuario);
      this.usuario = usuario; // Asignar información del usuario a la propiedad del servicio
      this.usuarioSubject.next(usuario); // Emitir la información del usuario a través del BehaviorSubject
    } catch (error) {
      console.error('Error al obtener información del usuario:', error);
      throw error; // Relanzar el error para manejarlo en el componente
    }
  }


  obtenerUrlLogin() {
    let urlbase = 'https://accounts.spotify.com/authorize?';
    const clientId = 'client_id=' + '910ce5a3c01a467f9c6454ba844cddc6' + '&'; // Codigo de cliente id de spotify
    const redirectUri = '&redirect_uri=' + 'http://localhost:4200/login/'; // Direccion de redireccionamiento una vez que el usuario inicia sesion
    const scope = '&scope=' + 'user-read-private user-library-read playlist-read-private playlist-modify-public playlist-modify-private'; // Permisos de acceso
    const response_type = '&response_type=token&show_dialog=true&';

    return urlbase + clientId + redirectUri + scope + response_type;
  }


  obtenertokenurlcallback() {
    // Verificar si window está definido
    if (typeof window !== 'undefined') {
      // Verificar si la hash de la URL está presente
      if (window.location.hash) {
        // Obtener los parámetros de la hash
        const params = window.location.hash.substring(1).split('&');
        // Encontrar y devolver el valor del token
        const tokenParam = params.find(param => param.startsWith('access_token='));
        if (tokenParam) {
          return tokenParam.split('=')[1];
        }
      }
    }
    // Si no hay hash o no se encuentra el token, devolver una cadena vacía
    return '';
  }

  definirAccessToken(token: string) {
    this.spotifyApi.setAccessToken(token);
    localStorage.setItem('token', token);
  }


  async buscarListasExitosDeTodosLosPaises(): Promise<IPlaylist[]> {
    const paises = ['US', 'UK', 'ES', 'FR', 'BR', 'DE', 'IT', 'JP', 'AU', 'BE'];

    interface PlaylistIds {
      [key: string]: string;
    }
  
    // Define los IDs de las listas de reproducción para cada país
    const playlistIds: PlaylistIds = {
      'US': '37i9dQZEVXbLRQDuF5jeBp', // Estados Unidos
      'UK': '37i9dQZEVXbLnolsZ8PSNw', // Reino Unido
      'ES': '37i9dQZEVXbNFJfN1Vw8d9', // España
      'FR': '37i9dQZEVXbIPWwFssbupI', // Francia
      'BR': '37i9dQZEVXbMXbN3EUUhlg', // Brasil
      'DE': '37i9dQZEVXbJiZcmkrIHGU', // Alemania
      'IT': '37i9dQZEVXbIQnj7RRhdSX', // Italia
      'JP': '37i9dQZEVXbKXQ4mDTEBXq', // Japón
      'AU': '37i9dQZEVXbJPcfkRz0wJ0',  // Australia
      'BE': '37i9dQZEVXbJNSeeHswcKB'  // Belgica
    };
  
    const playlistsPromises = paises.map(async (pais) => {
      const playlistId = playlistIds[pais];
      const playlist = await this.spotifyApi.getPlaylist(playlistId); // Obtener información de la lista de reproducción
      return SpotifyPlaylistParaPlaylist(playlist); // Convertir la información de la lista de reproducción al formato deseado
    });
  
    return Promise.all(playlistsPromises);
  }

  logout() {
    localStorage.clear();
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
