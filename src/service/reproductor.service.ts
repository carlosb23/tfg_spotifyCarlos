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
  contadorTiempo = new BehaviorSubject<number>(0);
  reproduciendo = new BehaviorSubject<boolean>(false);

  vistaSonando: boolean = false;

  constructor(private spotifyService: SpotifyService) { }

  cambiarEstadoVistaSonando(): void {
    this.vistaSonando = !this.vistaSonando;
  }


  async obtenermusicaActual() {
    clearTimeout(this.timerId);

    const musica = await this.spotifyService.obtenerMusicaAtual();
    
    if (this.musicaActual.value.id !== musica.id) {
      this.definirmusicaActual(musica);
    }

    this.timerId = setTimeout(async () => {
      await this.obtenermusicaActual();
    }, 1000);
  }

  definirmusicaActual(musica: IMusica) {
    this.musicaActual.next(musica);
    this.contadorTiempo.next(0);
    this.reproduciendo.next(true);
  }

  actualizarContadorTiempo(tiempo: number) {
    this.contadorTiempo.next(tiempo);
  }

  cambiarEstadoReproduccion(estado: boolean) {
    this.reproduciendo.next(estado);
  }

  // Métodos de control de reproducción
  async pausarMusica() {
    await this.spotifyService.pausarMusica();
    this.cambiarEstadoReproduccion(false);
  }

  async reanudarMusica() {
    await this.spotifyService.reanudarMusica();
    this.cambiarEstadoReproduccion(true);
  }

  async reproducirDesdeTiempo(tiempo: number) {
    this.spotifyService.reproducirDesdeTiempo(tiempo);
    this.actualizarContadorTiempo(tiempo);
  }

  async volumenCambia(volumen: number) {
    await this.spotifyService.volumenCambia(volumen);
  }


  

}
