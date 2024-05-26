import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpotifyService } from '../../../service/spotify.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  errorMessage: any;
  showPopup: boolean = false;
  popupStyle: any = {};


  constructor(
    private sessionService: SpotifyService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.verificarTokencallback();
  }


  async login() {
    const url = this.sessionService.obtenerUrlLogin();
    await Browser.open({ url: url, windowName: '_self' });
  }

  verificarTokencallback() {
    const token = this.sessionService.obtenertokenurlcallback();
    if (!!token) {
      this.sessionService.definirAccessToken(token);
      this.router.navigate(['/inicio/home']);
    }
  }

  async abrirPaginaLogin() {
    window.location.href = this.sessionService.obtenerUrlLogin();
  }

  abrirCreador() {
    this.showPopup = !this.showPopup;
    if (this.showPopup) {
      // Calcula la posición del botón para el div flotante
      const buttonPosition = document.querySelector('button').getBoundingClientRect();
      this.popupStyle = {
        top: `${buttonPosition.bottom}px`,
        left: `${buttonPosition.left}px`
      };
    } else {
      this.popupStyle = {};
    }
  }
}
