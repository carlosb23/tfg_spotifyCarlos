
import { Injectable } from '@angular/core';
import Spotify from 'spotify-web-api-js';
import { IUsuario } from '../app/Interfaces/IUsuario';
import { SpotifyPlaylistParaPlaylist, SpotifyUserParaUsuario } from '../app/common/spotifyHelper';
import { IPlaylist } from '../app/Interfaces/IPlaylist';
import { Console } from 'console';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  spotifyApi: Spotify.SpotifyWebApiJs = null;
  usuario: IUsuario;

  constructor() {
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
    const userInfo = await this.spotifyApi.getMe();
    console.log('Información de usuario obtenida:', userInfo);
    this.usuario = SpotifyUserParaUsuario(userInfo);
  }


  obtenerUrlLogin() {
    let urlbase = 'https://accounts.spotify.com/authorize?';
    const clientId = 'client_id=' + '910ce5a3c01a467f9c6454ba844cddc6' + '&'; // Codigo de cliente id de spotify
    const redirectUri = '&redirect_uri=' + 'http://localhost:4200/login/'; // Direccion de redireccionamiento una vez que el usuario inicia sesion
    const scope = '&scope=' + 'user-read-private user-library-read playlist-read-private playlist-modify-public playlist-modify-private'; // Permisos de acceso
    const response_type = '&response_type=token&show_dialog=true';

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
    const paises = ['US', 'UK', 'ES', 'FR', 'BR', 'DE', 'IT', 'JP', 'AU'];
    const playlistIds = ['37i9dQZEVXbMDoHDwVN2tF', '37i9dQZEVXbMDoHDwVN2tF', '37i9dQZEVXbMDoHDwVN2tF', 
    '37i9dQZEVXbMDoHDwVN2tF', '37i9dQZEVXbMDoHDwVN2tF', '37i9dQZEVXbMDoHDwVN2tF', '37i9dQZEVXbMDoHDwVN2tF', '37i9dQZEVXbMDoHDwVN2tF', '37i9dQZEVXbMDoHDwVN2tF'];

    const playlistsPromises = paises.map(async (pais, index) => {
      // Obtener el nombre del país actual
      const countryCode = pais.toLowerCase();
      const countryName = await this.obtenerNombrePais(countryCode);

      // Obtener la playlist de éxitos del país actual
      const playlistId = playlistIds[index];
      const playlistTracks = await this.spotifyApi.getPlaylistTracks(playlistId, { limit: 50 });

      // Mapear las canciones de la playlist a la interfaz IPlaylist
      const playlistSongs = playlistTracks.items.map(track => ({
        id: track.track.id,
        name: track.track.name,
        artistas: '',
        imagenUrl: ''
      }));

      // Crear el objeto IPlaylist con el nombre de la playlist, el país y las canciones
      return {
        name: `Top 50 ${countryName}`,
        country: countryName,
        songs: playlistSongs
      };
    });

    // Utilizar 'Promise.all' para esperar todas las promesas y luego aplanar el arreglo de arreglos resultante
    const playlistsByCountry = await Promise.all(playlistsPromises);

    return playlistsByCountry;
  }

  async obtenerNombrePais(countryCode: string): Promise<string> {
    switch (countryCode) {
      case 'us': return 'Estados Unidos';
      case 'uk': return 'Reino Unido';
      case 'es': return 'España';
      case 'fr': return 'Francia';
      case 'br': return 'Brasil';
      case 'de': return 'Alemania';
      case 'it': return 'Italia';
      case 'jp': return 'Japón';
      case 'au': return 'Australia';
      default: return 'Desconocido';
    }
  }
}
