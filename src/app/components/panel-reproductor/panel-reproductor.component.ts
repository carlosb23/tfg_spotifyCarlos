import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IMusica } from '../../Interfaces/IMusica';
import { newMusica } from '../../common/spotifyHelper2';
import { ReproductorService } from '../../../service/reproductor.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { HomeComponent } from '../../componentes/home/home.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panel-reproductor',
  standalone: true,
  imports: [FontAwesomeModule, HomeComponent, CommonModule],
  templateUrl: './panel-reproductor.component.html',
  styleUrl: './panel-reproductor.component.css'
})
export class PanelReproductorComponent implements OnInit, OnDestroy {
  musica: IMusica = newMusica();
  subs: Subscription[] = []
  @Input() musicas: IMusica[] = [];

  //iconos
  botonplay = faPlay;
  botonAnterior = faStepBackward;
  botonSiguiente = faStepForward;

  //Para el contador

  contadorTiempo: number = 0;
  duracionTotal: number = 0;
  intervalId: any;

  constructor(private reproductorService: ReproductorService) { }

  ngOnInit(): void {
    this.obtenermusicasonando();

  }

  ngAfterViewChecked(): void {
    this.verificarAnchoTexto();
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
      }
    }
  }
  iniciarContadorDeTiempo(): void {
    // Limpiar el intervalo anterior antes de iniciar uno nuevo
    clearInterval(this.intervalId);

    this.contadorTiempo = 0; // Reiniciar el contador de tiempo
    this.intervalId = setInterval(() => {
      if (this.contadorTiempo < this.duracionTotal) {
        this.contadorTiempo++; // Incrementar el contador de tiempo
        const progressBar = document.querySelector('.barra-progreso') as HTMLElement;
        const valor = (this.contadorTiempo / this.duracionTotal) * 100;
        progressBar.style.setProperty('--range-value', `${valor}%`);
      } else {
        clearInterval(this.intervalId); // Detener el intervalo cuando se alcanza la duración total
      }
    }, 1000); // Actualizar cada segundo
}


  formatarTiempo(tiempo: number): string {
    const minutos = Math.floor(tiempo / 60);
    const segundos = tiempo % 60;
    const minutosFormateados = minutos < 10 ? `${minutos}` : minutos;
    const segundosFormateados = segundos < 10 ? `0${segundos}` : segundos;
    return `${minutosFormateados}:${segundosFormateados}`;
  }

}



