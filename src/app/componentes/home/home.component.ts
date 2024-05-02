import { Component } from '@angular/core';
import { Top50ubiComponent } from '../../components/top50ubi/top50ubi.component';
import { PanelDerechoComponent } from '../../components/panel-derecho/panel-derecho.component';
import { IMusica } from '../../Interfaces/IMusica';
import { SpotifyService } from '../../../service/spotify.service';
import { IUsuario } from '../../Interfaces/IUsuario';
import { ParteUsuarioComponent } from '../../components/parte-usuario/parte-usuario.component';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Top50ubiComponent,PanelDerechoComponent,ParteUsuarioComponent,CommonModule,FontAwesomeModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  usuario: IUsuario = null;
  usuarioSubscription: Subscription;
  musicas: IMusica[] = []

  //Icono play
  playIcon = faPlay



  constructor(private spotifyService: SpotifyService,private snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.obtenerMusica();

    this.usuarioSubscription = this.spotifyService.usuarioObservable.subscribe(usuario => {
      this.usuario = usuario;
      console.log('Usuario en ParteUsuarioComponent:', this.usuario);
    });
    
    // Inicializar el usuario si aún no está inicializado
    if (!this.spotifyService.usuario) {
      this.spotifyService.inicializarUsuario();
    }
  }

  async obtenerMusica() {
    this.musicas = await this.spotifyService.buscarMusicas();
  }

  obtenerArtistas(musica: IMusica) {
    return musica.artistas.map(artista => artista.name).join(', ');
  }

  async executarMusica(musica: IMusica) {
    try {
      await this.spotifyService.ejecutarMusica(musica.id);
    } catch (error) {
      this.mostrarSnackBar('No puedes reproducir musica, pulsa aleatorio o hazte premium');
    }
  }

  private mostrarSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000 
    });
  }
}
