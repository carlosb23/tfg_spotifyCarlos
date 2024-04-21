
import { Injectable } from '@angular/core';
import Spotify from 'spotify-web-api-js';
import { IUsuario } from '../app/Interfaces/IUsuario';
import { SpotifyUserParaUsuario } from '../app/common/spotifyHelper';

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
    if(!!this.usuario)
      return true;

    const token = localStorage.getItem('token');

    if(!token)
      return false;

    try {

      this.definirAccessToken(token);
      await this.obterSpotifyUsuario();
      return !!this.usuario;

    }catch(ex){
      return false;
    }
  }

  async obterSpotifyUsuario() {
    const userInfo = await this.spotifyApi.getMe();
    this.usuario = SpotifyUserParaUsuario(userInfo);
  }


  obtenerUrlLogin() {
    let urlbase = 'https://accounts.spotify.com/authorize?';
    const clientId = 'client_id=' + '910ce5a3c01a467f9c6454ba844cddc6' + '&'; // Codigo de cliente id de spotify
    const redirectUri = '&redirect_uri='+ 'http://localhost:4200/login/'; // Direccion de redireccionamiento una vez que el usuario inicia sesion
    const scope = '&scope=' + 'user-read-private user-library-read playlist-read-private playlist-modify-public playlist-modify-private'; // Permisos de acceso
    const response_type = '&response_type=code';

    return urlbase + clientId + redirectUri + scope + response_type;
  }


  obtenertokenurlcallback() {
    if (typeof window !== 'undefined' && window.location && window.location.search) {
        const queryString = window.location.search.substring(1);
        const params = new URLSearchParams(queryString);
        const code = params.get('code');
        return code ? code : '';
    } else {
        return '';
    }
}

  definirAccessToken(token: string) {
    this.spotifyApi.setAccessToken(token);
    localStorage.setItem('token', token);
  }

}
