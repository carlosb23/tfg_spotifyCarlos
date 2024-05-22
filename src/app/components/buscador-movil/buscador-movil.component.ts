import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BotonMenuComponent } from '../boton-menu/boton-menu.component';
import { IPlaylist } from '../../Interfaces/IPlaylist';
import { Router } from '@angular/router';
import { SpotifyService } from '../../../service/spotify.service';
import { PlaylistService } from '../../../service/playlist.service';
import { CajasListasComponent } from '../cajas-listas/cajas-listas.component';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-buscador-movil',
  standalone: true,
  imports: [FormsModule, CommonModule,CajasListasComponent,FontAwesomeModule],
  templateUrl: './buscador-movil.component.html',
  styleUrl: './buscador-movil.component.css'
})
export class BuscadorMovilComponent {

  playlist: IPlaylist[] = [];
  musicaselect = 'Lista';

  searchicon = faSearch;
  buscador = ''
  
  constructor(private router: Router, private spotifyService: SpotifyService,private playlistService: PlaylistService) { }

  buscarRecientes = [
    'Top Global','Top 50 España', 'Bad Bunny', 'Saiko', 'Myke Tower'
  ]

  



  definirbuscador(buscador:string){
    this.buscador = buscador;
  }

  buscar(){
    
  }

  ngOnInit(): void {
    this.initializeUserAndSearchPlaylist();

    this.playlistService.getPlaylistId().subscribe(playlistId => {
      this.musicaselect = playlistId;
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
      this.playlist = await this.spotifyService.buscarListasExitosDeTodosLosPaises();
      console.log('Playlists obtenidas:', this.playlist); // Registra los datos obtenidos
    } catch (error) {
      console.error('Error al buscar playlists:', error);
    }
  }


  irPlaylist(playlistId: string) {
    this.musicaselect = playlistId; // Actualiza el menú seleccionado
    this.router.navigateByUrl(`inicio/lista/playlist/${playlistId}`);
  }
}
