import { Component } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(
    private sessionService: SpotifyService) {
      
    }
  

  login() {
    window.location.href = this.sessionService.obtenerUrlLogin();
  }

  verificarTokencallback() {
    const token = this.sessionService.obtenertokenurlcallback();
    if(!!token) {
      this.sessionService.definirAccessToken(token);
    }
  }

}
