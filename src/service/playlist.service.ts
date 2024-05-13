import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMusica } from '../app/Interfaces/IMusica';

@Injectable({
  providedIn: 'root'
})
export class PlaylistService {

  private playlistIdSubject = new BehaviorSubject<string>('');

  musicaActual: IMusica | null = null;
  tiempoTranscurrido: number = 0;
  reproduciendo: boolean = false;

  private intervalId: any;

  constructor() { }

  setPlaylistId(playlistId: string) {
    this.playlistIdSubject.next(playlistId);
  }

  getPlaylistId() {
    return this.playlistIdSubject.asObservable();
  }

  definirmusicaActual(musica: IMusica): void {
    this.musicaActual = musica;
  }

  actualizarTiempoTranscurrido(tiempo: number): void {
    this.tiempoTranscurrido = tiempo;
  }

  actualizarEstadoReproduccion(reproduciendo: boolean): void {
    this.reproduciendo = reproduciendo;

    if (this.reproduciendo) {
      this.iniciarContadorDeTiempo();
    } else {
      this.detenerContadorDeTiempo();
    }
  }

  iniciarContadorDeTiempo(): void {
    this.detenerContadorDeTiempo(); // Detener el contador si ya está en funcionamiento
  }

  detenerContadorDeTiempo(): void {
    clearInterval(this.intervalId);
  }
}
