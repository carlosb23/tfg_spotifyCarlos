import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from 'express';
import Spotify from 'spotify-web-api-js'

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  spotifyApi: Spotify.SpotifyWebApiJs = null;

  constructor() {
    this.spotifyApi = new Spotify();
   }


  obtenerUrlLogin() {
    let urlbase = 'https://accounts.spotify.com/authorize?';
    const clientId = 'client_id=' + '910ce5a3c01a467f9c6454ba844cddc6' + '&'; // Codigo de cliente id de spotify
    const redirectUri = '&redirect_uri='+ 'http://localhost:4200/inicio'; // Direccion de redireccionamiento una vez que el usuario inicia sesion
    const scope = '&scope=' + 'user-read-private user-library-read playlist-read-private playlist-modify-public playlist-modify-private'; // Permisos de acceso
    const response_type = '&response_type=code';

    return urlbase + clientId + redirectUri + scope + response_type;
  }


  obtenertokenurlcallback(){
    console.log(window.location.hash)
    if(!window.location.hash)
      return '';

    const params = window.location.hash.substring(1).split('&');
    return params[0].split('=')[1]
    
  }

  definirAccessToken(token: string) {
    this.spotifyApi.setAccessToken(token);
    sessionStorage.setItem('token', token);
    this.spotifyApi.skipToNext();
  }

}
