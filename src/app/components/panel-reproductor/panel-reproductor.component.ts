import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IMusica } from '../../Interfaces/IMusica';
import { newMusica } from '../../common/spotifyHelper2';
import { ReproductorService } from '../../../service/reproductor.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPlay, faStepBackward, faStepForward } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { HomeComponent } from '../../componentes/home/home.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel-reproductor',
  standalone: true,
  imports: [FontAwesomeModule,HomeComponent,CommonModule],
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

  constructor(private reproductorService: ReproductorService) { }

  ngOnInit(): void {
    this.obtenermusicasonando();
  }
  obtenermusicasonando() {
    const sub = this.reproductorService.musicaActual.subscribe(musica => {
      this.musica = musica;
    })

    this.subs.push(sub);
  }

  ngOnDestroy(): void {
    
  }

  obtenerArtistas(musica: IMusica) {
    return musica.artistas.map(artista => artista.name).join(', ');
  }
    
}



