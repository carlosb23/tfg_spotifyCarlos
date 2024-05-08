import { Component } from '@angular/core';
import { IMusica } from '../../Interfaces/IMusica';
import { newMusica } from '../../common/spotifyHelper2';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { SpotifyService } from '../../../service/spotify.service';
import { BannerplaylistComponent } from '../../components/bannerplaylist/bannerplaylist.component';

@Component({
  selector: 'app-lista-musicas',
  standalone: true,
  imports: [BannerplaylistComponent],
  templateUrl: './lista-musicas.component.html',
  styleUrl: './lista-musicas.component.css'
})
export class ListaMusicasComponent {

  bannerImagenUrl = '';
  bannerTexto = '';

  musicas: IMusica[] = [];
  musicaActual: IMusica = newMusica();
  playIcon = faPlay;

  subs: Subscription[] = []

  constructor(private activatedRoute: ActivatedRoute, private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.obtenerMusicas();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  obtenerMusicas() {
    const sub = this.activatedRoute.paramMap.subscribe(async params => {
      await this.obtenerdatospagina(params.get('tipo'), params.get('id'));
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

  }

  async obtenerdatosartista(artistaId: string) {

  }

  definirdatosPagina(bannerImagenUrl: string, bannerTexto: string, musicas: IMusica[]) {
    this.bannerImagenUrl = bannerImagenUrl;
    this.bannerTexto = bannerTexto;
    this.musicas = musicas;
  }
}
