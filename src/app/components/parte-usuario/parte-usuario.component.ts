import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { IUsuario } from '../../Interfaces/IUsuario';
import { SpotifyService } from '../../../service/spotify.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-parte-usuario',
  standalone: true,
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './parte-usuario.component.html',
  styleUrl: './parte-usuario.component.css'
})
export class ParteUsuarioComponent implements OnInit,OnDestroy  {

  salirIcono = faSignOutAlt;
  usuario: IUsuario = null;
  usuarioSubscription: Subscription;

  constructor(private spotifyService: SpotifyService) {
    
  }

  ngOnInit(): void {
    // Suscribirse a los cambios en el usuario
    this.usuarioSubscription = this.spotifyService.usuarioObservable.subscribe(usuario => {
      this.usuario = usuario;
      console.log('Usuario en ParteUsuarioComponent:', this.usuario);
    });
    
    // Inicializar el usuario si aún no está inicializado
    if (!this.spotifyService.usuario) {
      this.spotifyService.inicializarUsuario();
    }
  }

  ngOnDestroy(): void {
    // Cancelar la suscripción al destruir el componente
    if (this.usuarioSubscription) {
      this.usuarioSubscription.unsubscribe();
    }
  }

  logout() {
    this.spotifyService.logout();
  }
}
