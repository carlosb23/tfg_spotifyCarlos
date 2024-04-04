import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../service/session.service';
import { SpotifyService } from '../../../service/spotify.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
errorMessage: any;
username: any = '';
password: any = '';

  constructor(
    private spotify: SpotifyService,
    private router: Router,
    private sessionService: SessionService) { 
      if(this.sessionService.estaLogueado()){
        this.router.navigate(['/inicio']);
    }
  }

  login() {
    const clientId = '910ce5a3c01a467f9c6454ba844cddc6'; // Codigo de cliente id de spotify
    const redirectUri = 'http://localhost:4200/inicio'; // Direccion de redireccionamiento una vez que el usuario inicia sesion
    const scope = 'user-read-private user-library-read playlist-read-private playlist-modify-public playlist-modify-private'; // Permisos de acceso

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
    window.location.href = authUrl;
  }


}
