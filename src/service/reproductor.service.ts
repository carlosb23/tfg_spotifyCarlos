import { Injectable } from '@angular/core';
import { IMusica } from '../app/Interfaces/IMusica';
import { newMusica } from '../app/common/spotifyHelper2';
import { BehaviorSubject, Observable } from 'rxjs';
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

    // Obtener la música actual de Spotify
    const musica = await this.spotifyService.obtenerMusicaAtual();
    
    // Verificar si la música actual ha cambiado
    if (this.musicaActual.value.id !== musica.id) {
        // Actualizar la música actual solo si ha cambiado
        this.definirmusicaActual(musica);
    }

    // Volver a iniciar el temporizador
    this.timerId = setTimeout(async () => {
        await this.obtenermusicaActual();
    }, 3000);
}

  definirmusicaActual(musica : IMusica) {
    this.musicaActual.next(musica);
  }

  async cancionAnterior() {
    await this.spotifyService.obtenerMusicaAnterior();
  }

  async proximaCancion() {
    await this.spotifyService.obtenerMusicaSeguiente();
  }

  async pausarMusica() {
    await this.spotifyService.pausarMusica();
  }

  async reanudarMusica() {
    await this.spotifyService.reanudarMusica();
  }

  async reproducirDesdeTiempo(tiempo: number) {
    this.spotifyService.reproducirDesdeTiempo(tiempo);
  }

  async volumenCambia(volumen: number) {
    await this.spotifyService.volumenCambia(volumen);
    
  }


  

}
