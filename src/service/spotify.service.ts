import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpotifyService {

  private spotifyApiUrl = 'https://api.spotify.com/v1';

  constructor(private http: HttpClient) { }

  login() {
    
  }

  
  
}
