import { Injectable } from '@angular/core';
import { IMusica } from '../app/Interfaces/IMusica';
import { newMusica } from '../app/common/spotifyHelper2';
import { BehaviorSubject } from 'rxjs';
import { SpotifyService } from './spotify.service';

@Injectable({
  providedIn: 'root'
})
export class ReproductorService {

  musicaActual = new BehaviorSubject<IMusica>(newMusica());
  timerId: any = null;

  constructor(private spotifyService: SpotifyService) { }


  async obtenermusicaActual() {
    clearTimeout(this.timerId);

    //obtener musica
    const musica = await this.spotifyService.obtenerMusicaAtual();
    this.definirmusicaActual(musica);

    //obtener musica cada 3
    this.timerId = setInterval(async () => {
      await this.obtenermusicaActual();
    }, 3000);
  }

  definirmusicaActual(musica : IMusica) {
    this.musicaActual.next(musica);
  }

}
