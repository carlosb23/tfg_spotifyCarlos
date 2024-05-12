import { Component, HostListener } from '@angular/core';
import { IMusica } from '../../Interfaces/IMusica';
import { newMusica } from '../../common/spotifyHelper2';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SpotifyService } from '../../../service/spotify.service';
import { BannerplaylistComponent } from '../../components/bannerplaylist/bannerplaylist.component';
import { PanelDerechoComponent } from '../../components/panel-derecho/panel-derecho.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReproductorService } from '../../../service/reproductor.service';
import { CommonModule } from '@angular/common';
import { PanelReproductorComponent } from '../../components/panel-reproductor/panel-reproductor.component';

@Component({
  selector: 'app-lista-musicas',
  standalone: true,
  imports: [BannerplaylistComponent,PanelDerechoComponent,FontAwesomeModule,CommonModule,PanelReproductorComponent],
  templateUrl: './lista-musicas.component.html',
  styleUrl: './lista-musicas.component.css'
})
export class ListaMusicasComponent {

  bannerImagenUrl = '';
  bannerTexto = '';

  title = '';

  musicas: IMusica[] = []
  musicaActual: IMusica = newMusica();
  playIcon = faPlay;

  subs: Subscription[] = []
  isScrolled = false;

  constructor(private activatedRoute: ActivatedRoute, private spotifyService: SpotifyService,private reproductorService: ReproductorService) { }

  ngOnInit(): void {
    this.obtenerMusicas();
    this.obtenermusicaActual();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Verifica si se ha hecho scroll hacia abajo
    this.isScrolled = window.scrollY > 0;
  }

  obtenerMusicas() {
    const sub = this.activatedRoute.paramMap.subscribe(async params => {
      await this.obtenerdatospagina(params.get('tipo'), params.get('id'));
    });
    this.subs.push(sub);
  }

  obtenermusicaActual() {
    const sub = this.reproductorService.musicaActual.subscribe(musica =>{
      this.musicaActual = musica;
    });

    this.subs.push(sub);
  }

  async obtenerdatospagina(tipo: string, id: string) {
    if(tipo === 'playlist') {
      await this.obtenerdatosplaylist(id);
    }else{
      await this.obtenerdatosartista(id);
    }
  }

  async obtenerdatosplaylist(playlistId: string) {
    const playlistMusicas = await this.spotifyService.buscarMusicasPlaylist(playlistId);
    this.definirdatosPagina(playlistMusicas.name, playlistMusicas.imagenUrl, playlistMusicas.musicas);
    this.title = 'Musicas Playlist: ' + playlistMusicas.name;

  }

  async obtenerdatosartista(artistaId: string) {

  }

  definirdatosPagina(bannerTexto: string, bannerImagenUrl: string , musicas: IMusica[]) {
    this.bannerImagenUrl = bannerImagenUrl;
    this.bannerTexto = bannerTexto;
    this.musicas = musicas;
  }

  obtenerArtistas(musica: IMusica){
    return musica.artistas.map(artista => artista.name).join(', ');
  }

  async executeMusica(musica: IMusica) {
    try {
      await this.spotifyService.ejecutarMusica(musica.id);
      this.reproductorService.definirmusicaActual(musica);
    } catch (error) {
      alert('Contrata premium para esta funcionalidad/abre spotify https://open.spotify.com/intl-es o pulsa aleatorio');
    }
  }
}
