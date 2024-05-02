
import { Injectable } from '@angular/core';
import Spotify from 'spotify-web-api-js';
import { IUsuario } from '../app/Interfaces/IUsuario';
import { SpotifyPlaylistParaPlaylist, SpotifyTrackParaMusica, SpotifyUserParaUsuario } from '../app/common/spotifyHelper';
import { IPlaylist } from '../app/Interfaces/IPlaylist';
import { Console } from 'console';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IMusica } from '../app/Interfaces/IMusica';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
  obtenerMusica() {
    throw new Error('Method not implemented.');
  }

  spotifyApi: Spotify.SpotifyWebApiJs = null;
  usuario: IUsuario;
  private usuarioSubject = new BehaviorSubject<IUsuario>(null);
  usuarioObservable = this.usuarioSubject.asObservable();

  constructor(private router: Router,private http: HttpClient) {
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
    const paises = ['US', 'UK', 'ES', 'FR', 'BR', 'DE', 'IT', 'JP', 'AU', 'BE', 'global'];

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
      'BE': '37i9dQZEVXbJNSeeHswcKB',  // Belgica
      'global': '37i9dQZEVXbMDoHDwVN2tF'
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


  //Musica de la lista de spotify top global

  async buscarMusicas(offset=0, limit=50): Promise<IMusica[]> {
    const musicas = await this.spotifyApi.getMySavedTracks({offset, limit});
    return musicas.items.map(x => SpotifyTrackParaMusica(x.track)); 
  }

  //ejecutar la musica

  async ejecutarMusica(musicaId: string) {
    await this.spotifyApi.queue(musicaId);
    await this.spotifyApi.skipToNext();
  }

  async ejecutarmusicaaleatoria() {
    await this.spotifyApi.play
  }


  //Ubicacion listas

  async buscarListasExitosUbi(): Promise<IPlaylist[]> {
    let country = await this.obtenerPaisPorGeolocalizacion();
    if (!country) {
      // Si la ubicación no está disponible, o el país no está en la lista, mostrar la lista global.
      country = 'global';
    }
    return this.buscarListasExitosDePais(country);
  }

  async obtenerPaisPorGeolocalizacion(): Promise<string> {
    try {
      const url = 'https://ipapi.co/json/';
      const response: any = await this.http.get(url).toPromise();
      return response.country_code;
    } catch (error) {
      console.error('Error obteniendo la ubicación del usuario:', error);
      return null;
    }
  }

  async buscarListasExitosDePais(country: string): Promise<IPlaylist[]> {
    // Lógica para obtener la lista de reproducción del país especificado
    const playlistIds: { [key: string]: string } = {
      'US': '37i9dQZEVXbLRQDuF5jeBp', // Estados Unidos
      'UK': '37i9dQZEVXbLnolsZ8PSNw', // Reino Unido
      'ES': '37i9dQZEVXbNFJfN1Vw8d9', // España
      'FR': '37i9dQZEVXbIPWwFssbupI', // Francia
      'BR': '37i9dQZEVXbMXbN3EUUhlg', // Brasil
      'DE': '37i9dQZEVXbJiZcmkrIHGU', // Alemania
      'IT': '37i9dQZEVXbIQnj7RRhdSX', // Italia
      'JP': '37i9dQZEVXbKXQ4mDTEBXq', // Japón
      'AU': '37i9dQZEVXbJPcfkRz0wJ0',  // Australia
      'BE': '37i9dQZEVXbJNSeeHswcKB',  // Belgica
      'global': '37i9dQZEVXbMDoHDwVN2tF' // Lista global
    };

    const playlistId = playlistIds[country];
    const playlist = await this.spotifyApi.getPlaylist(playlistId);
    return [SpotifyPlaylistParaPlaylist(playlist)];
  }
}
