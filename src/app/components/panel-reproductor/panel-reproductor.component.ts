import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IMusica } from '../../Interfaces/IMusica';
import { newMusica } from '../../common/spotifyHelper2';
import { ReproductorService } from '../../../service/reproductor.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCaretSquareRight, faPause, faPlay, faStepBackward, faStepForward, faVolumeHigh, faVolumeLow, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { HomeComponent } from '../../componentes/home/home.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpotifyService } from '../../../service/spotify.service';
import { IPlaylist } from '../../Interfaces/IPlaylist';

@Component({
  selector: 'app-panel-reproductor',
  standalone: true,
  imports: [FontAwesomeModule, HomeComponent, CommonModule, FormsModule],
  templateUrl: './panel-reproductor.component.html',
  styleUrl: './panel-reproductor.component.css'
})
export class PanelReproductorComponent implements OnInit, OnDestroy {
  musica: IMusica = newMusica();
  subs: Subscription[] = []
  @Input() musicas: IMusica[] = [];
  @Input() playlistSeleccionada: IPlaylist;



  //iconos
  botonplay = faPlay;
  botonAnterior = faStepBackward;
  botonSiguiente = faStepForward;
  botonPausar = faPause;
  iconoAgrandar = faCaretSquareRight;

  //iconos de volumen
  iconoSilencio = faVolumeMute;
  iconodownvolume = faVolumeLow;
  iconovolumeup = faVolumeUp;
  iconovolumenmid = faVolumeHigh;


  //Para el contador

  contadorTiempo: number = 0;
  duracionTotal: number = 0;
  tiempoReproduccionActual: number = 0;
  intervalId: any;

  volumenActual: number = 30;
  isMuted: boolean = false;
  volumenAnterior: number = 30;

  reproduciendo: boolean = false;
  vistaSonando: boolean = false;

  constructor(private reproductorService: ReproductorService, private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.obtenermusicasonando();
  document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
  }

  ngAfterViewChecked(): void {
    this.verificarAnchoTexto();
  }

  toggleVistaSonando(): void {
    this.reproductorService.cambiarEstadoVistaSonando();
    this.vistaSonando = !this.vistaSonando;
  }

  

  convertirTiempoASegundos(tiempo: string): number {
    const partes = tiempo.split(':');
    const minutos = parseInt(partes[0], 10);
    const segundos = parseInt(partes[1], 10);
    return minutos * 60 + segundos;
  }

  // Luego, en el método donde asignas la duración total:

  obtenermusicasonando() {
    const sub = this.reproductorService.musicaActual.subscribe(musica => {
      this.musica = musica;
      this.duracionTotal = this.convertirTiempoASegundos(musica.tiempo);
      this.iniciarContadorDeTiempo();
    });

    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
    if (typeof document !== 'undefined') {
      clearInterval(this.intervalId);
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
  }

  obtenerArtistas(musica: IMusica) {
    return musica.artistas.map(artista => artista.name).join(', ');
  }

  verificarAnchoTexto() {
    const artistasContainer = document.querySelector('.artistas-container');
    const artistas = document.querySelector('.artistas');
  
    if (artistas && artistasContainer) {
      const artistasWidth = artistas.getBoundingClientRect().width;
      const containerWidth = artistasContainer.getBoundingClientRect().width;
  
      if (artistasWidth > containerWidth) {
        artistas.classList.add('anima');
      } else {
        artistas.classList.remove('anima'); // Remover la clase si ya no es necesaria
      }
    }
  }

  handleVisibilityChange(): void {
    if (document.visibilityState === 'hidden') {
      // Pausar la actualización de la barra de progreso cuando la página está oculta
      clearInterval(this.intervalId);
    } else {
      // Reanudar la actualización de la barra de progreso cuando la página está visible
      this.iniciarContadorDeTiempo();
    }
  }

  iniciarContadorDeTiempo(): void {
    clearInterval(this.intervalId);
    this.reproduciendo = true;

    // Verificar si hay una canción seleccionada
    if (this.musica && this.duracionTotal > 0) {
      this.contadorTiempo = 0;
      this.intervalId = setInterval(() => {
        if (this.reproduciendo) {
          if (this.contadorTiempo < this.duracionTotal) {
            this.contadorTiempo++;
            const progressBar = document.querySelector('.barra-progreso') as HTMLElement;
            const valor = (this.contadorTiempo / this.duracionTotal) * 100;
            progressBar.style.setProperty('--range-value', `${valor}%`);
          } else {
            clearInterval(this.intervalId);
            this.detectarFinalCancion();
          }
        }
      }, 1000);
    }
  }

  detectarFinalCancion(): void {
    clearInterval(this.intervalId);
    const indiceActual = this.musicas.findIndex(musica => musica.id === this.musica.id);
    let indiceSiguiente = indiceActual + 1;

    // Verificar si llegamos al final de la lista
    if (indiceSiguiente >= this.musicas.length) {
      indiceSiguiente = 0; // Volver al principio de la lista
    }

    const proximaCancion = this.musicas[indiceSiguiente];
    this.reproductorService.definirmusicaActual(proximaCancion);
    this.executeMusica(proximaCancion);
  }


  formatarTiempo(tiempo: number): string {
    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;
    const minutosFormateados = minutos < 10 ? `${minutos}` : minutos;
    const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;
    return `${minutosFormateados}:${segundosFormateados}`;
  }


  cancionAnterior() {
    const indiceActual = this.musicas.findIndex(musica => musica.id === this.musica.id);
    const indiceAnterior = indiceActual > 0 ? indiceActual - 1 : this.musicas.length - 1;
    const cancionAnterior = this.musicas[indiceAnterior];

    this.reproductorService.definirmusicaActual(cancionAnterior);
    this.executeMusica(cancionAnterior);
  }

  proximaCancion() {
    const indiceActual = this.musicas.findIndex(musica => musica.id === this.musica.id);
    const indiceProximo = (indiceActual + 1) % this.musicas.length;
    const proximaCancion = this.musicas[indiceProximo];

    this.reproductorService.definirmusicaActual(proximaCancion);
    this.executeMusica(proximaCancion);
  }

  async executeMusica(musica: IMusica) {
    try {
      await this.spotifyService.ejecutarMusica(musica.id);
      this.reproductorService.definirmusicaActual(musica);
      this.iniciarContadorDeTiempo();
    } catch (error) {
      alert('Contrata premium para esta funcionalidad/abre spotify https://open.spotify.com/intl-es o pulsa aleatorio');
    }
  }
  

  pausarReproduccion(): void {
    this.reproduciendo = false;
    this.reproductorService.pausarMusica();
  }

  reanudarReproduccion(): void {
    this.reproduciendo = true;
    this.reproductorService.reanudarMusica();
  }

  adelantarBarraProgreso(tiempo: number): void {
    this.contadorTiempo += tiempo;
    this.reproducirDesde(this.contadorTiempo);
  }

  atrasarBarraProgreso(tiempo: number): void {
    this.contadorTiempo -= tiempo;
    this.reproducirDesde(this.contadorTiempo);
  }

  reproducirDesde(tiempo: number): void {
    this.contadorTiempo = tiempo;
    this.reproductorService.reproducirDesdeTiempo(tiempo);
  }

  cambiarVolumen(event: Event): void {
    const target = event.target as HTMLInputElement;
    const valor = parseInt(target.value, 10);
    this.volumenActual = valor; // Actualiza el valor del volumen en el componente

    // Actualiza la variable --range-value en el elemento HTML
    const progressBar = document.querySelector('.barra-volumen') as HTMLElement;
    const valorPorcentaje = (valor / 100) * progressBar.clientWidth;
    progressBar.style.setProperty('--range-value', `${valorPorcentaje}px`);

    this.reproductorService.volumenCambia(valor); // Llama a la función para cambiar el volumen en Spotify
  }

  toggleMute(): void {
    if (this.isMuted) {
      // Si ya está en silencio, restauramos el volumen anterior y establecemos el estado de silencio como falso
      this.volumenActual = this.volumenAnterior;
      this.isMuted = false;
    } else {
      // Guardamos el volumen actual antes de silenciarlo, para poder restaurarlo más tarde
      this.volumenAnterior = this.volumenActual;
      // Establecemos el volumen actual a cero para silenciar la música y establecemos el estado de silencio como verdadero
      this.volumenActual = 0;
      this.isMuted = true;
    }
    // Actualizamos el volumen en el servicio
    this.reproductorService.volumenCambia(this.volumenActual);

    // Actualizamos el marcado de la barra de volumen
    const progressBar = document.querySelector('.barra-volumen') as HTMLElement;
    const valorPorcentaje = this.isMuted ? 0 : (this.volumenActual / 100) * progressBar.clientWidth;
    progressBar.style.setProperty('--range-value', `${valorPorcentaje}px`);
  }

  getIconForVolume(volumen: number): any {
    const volumenMute = 0;
    const volumenBajo = 40;
    const volumenMedio = 70;

    if (volumen <= volumenMute) {
      return this.iconoSilencio;
    } else if (volumen <= volumenBajo) {
      return this.iconodownvolume;
    } else if (volumen <= volumenMedio) {
      return this.iconovolumeup;
    }
  }

}
