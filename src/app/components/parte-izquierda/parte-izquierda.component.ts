import { Component, OnInit } from '@angular/core';
import { BotonMenuComponent } from '../boton-menu/boton-menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGlobe, faHome, faMusic, faSearch } from '@fortawesome/free-solid-svg-icons';
import { IPlaylist } from '../../Interfaces/IPlaylist';
import { SpotifyService } from '../../../service/spotify.service';
import { CommonModule } from '@angular/common';
import { ParteUsuarioComponent } from '../parte-usuario/parte-usuario.component';
import { Router } from '@angular/router';
import { Top50ubiComponent } from '../top50ubi/top50ubi.component';
import { PlaylistService } from '../../../service/playlist.service';

@Component({
  selector: 'app-parte-izquierda',
  standalone: true,
  imports: [BotonMenuComponent, FontAwesomeModule, CommonModule, ParteUsuarioComponent,Top50ubiComponent],
  templateUrl: './parte-izquierda.component.html',
  styleUrl: './parte-izquierda.component.css'
})


export class ParteIzquierdaComponent implements OnInit {

  menuSelected = 'Inicio';

  playlist: IPlaylist[] = [];



  //Declaramos los iconos a usar
  homeIcon = faHome;
  searchIcon = faSearch;
  countryIcon = faGlobe;
  playlistIcon = faMusic;

  constructor(private router: Router,
    private spotifyService: SpotifyService,
    private playlistService: PlaylistService
  ) {

  }

  ngOnInit(): void {
    this.initializeUserAndSearchPlaylist();

    this.playlistService.getPlaylistId().subscribe(playlistId => {
      this.menuSelected = playlistId;
    });
  }

  async initializeUserAndSearchPlaylist() {
     // Inicializar el usuario
    const userInitialized = await this.spotifyService.inicializarUsuario();
     
     if (userInitialized) {
       // Si el usuario se inicializa correctamente, buscar las playlists
       await this.searchPlaylist();
     } else {
        
     }
   }
 
  async searchPlaylist() {
     try {
       // Buscar las playlists una vez que el usuario está inicializado
       this.playlist = await this.spotifyService.buscarListasExitosDeTodosLosPaises();
       console.log(this.playlist);
     } catch (error) {
       console.error('Error al buscar playlists:', error);
     }
   }

  botonClick(boton: string) {
    this.menuSelected = boton;
    this.router.navigateByUrl('inicio/home');
  }

  irPlaylist(playlistId: string) {
    this.menuSelected = playlistId; // Actualiza el menú seleccionado
    this.router.navigateByUrl(`inicio/lista/playlist/${playlistId}`);
  }

}
