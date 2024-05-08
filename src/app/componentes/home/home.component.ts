import { Component, OnDestroy } from '@angular/core';
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
import { ReproductorService } from '../../../service/reproductor.service';
import { newMusica } from '../../common/spotifyHelper2';
import { BuscadorRecientesComponent } from '../../components/buscador-recientes/buscador-recientes.component';
import { PanelReproductorComponent } from '../../components/panel-reproductor/panel-reproductor.component';
import { ListaMusicasComponent } from '../lista-musicas/lista-musicas.component';
import { BannerplaylistComponent } from '../../components/bannerplaylist/bannerplaylist.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Top50ubiComponent,PanelDerechoComponent,ParteUsuarioComponent,CommonModule,FontAwesomeModule,BuscadorRecientesComponent,PanelReproductorComponent,ListaMusicasComponent,BannerplaylistComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnDestroy{
  usuario: IUsuario = null;
  usuarioSubscription: Subscription;
  musicas: IMusica[] = []
  musicaActual: IMusica = newMusica();

  subs: Subscription[] = [];

  //Icono play
  playIcon = faPlay



  constructor(
    private spotifyService: SpotifyService,
    private snackBar: MatSnackBar,
    private reproductorService: ReproductorService
  ) { }

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

    this.obtenermusicaActual();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }


  async obtenerMusica() {
    this.musicas = await this.spotifyService.buscarMusicas();
  }

  obtenermusicaActual() {
    const sub = this.reproductorService.musicaActual.subscribe(musica =>{
      this.musicaActual = musica;
    });

    this.subs.push(sub);
  }
  obtenerArtistas(musica: IMusica) {
    return musica.artistas.map(artista => artista.name).join(', ');
  }

  async executeMusica(musica: IMusica) {
    try {
      await this.spotifyService.ejecutarMusica(musica.id);
      this.reproductorService.definirmusicaActual(musica);
    } catch (error) {
      alert('Contrata premium para esta funcionalidad o pulsa aleatorio');
    }
  }

  async reproducirCancionAleatoriaGustada() {
    try {
      // Obtener todas las canciones con vista previa
      const musicas = await this.spotifyService.obtenerCancionesGustadasAleatorias();
  
      // Verificar si hay canciones disponibles
      if (musicas.length === 0) {
        throw new Error('No hay canciones disponibles con una URL de vista previa.');
      }
  
      // Generar un índice aleatorio dentro del rango de las canciones disponibles
      const indiceAleatorio = Math.floor(Math.random() * musicas.length);
  
      // Reproducir la canción aleatoria correspondiente al índice aleatorio generado
      const audio = new Audio(musicas[indiceAleatorio].previewUrl);
      audio.play();
    } catch (error) {
      console.error('Error al reproducir canción aleatoria gustada:', error);
    }
  }
  private mostrarSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 4000 
    });
  }
}
