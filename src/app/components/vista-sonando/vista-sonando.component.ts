import { Component, ElementRef, Input } from '@angular/core';
import { IMusica } from '../../Interfaces/IMusica';
import { newArtista, newMusica } from '../../common/spotifyHelper2';
import { IArtista } from '../../Interfaces/IArtista';
import { Subscription } from 'rxjs';
import { ReproductorService } from '../../../service/reproductor.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SpotifyService } from '../../../service/spotify.service';

@Component({
  selector: 'app-vista-sonando',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './vista-sonando.component.html',
  styleUrl: './vista-sonando.component.css'
})
export class VistaSonandoComponent {

  musica: IMusica = newMusica();
  subs: Subscription[] = [];
  artista: IArtista;

  musicaActual: IMusica;
  imagenArtista: string;

  @Input()
  artistafoto = '';

  constructor(private reproductorService: ReproductorService, private elRef: ElementRef, private spotifyService: SpotifyService) { }

  ngOnInit(): void {
    this.obtenermusicasonando();
  }

  ngAfterViewChecked(): void {
    this.verificarAnchoTexto();
  }

  async obtenermusicasonando() {
    const sub = this.reproductorService.musicaActual.subscribe(async (musica: IMusica) => {
      this.musica = musica;
      const artistaId = musica.artistas.length > 0 ? musica.artistas[0].id : '';
      this.artista = await this.spotifyService.obtenerDetallesArtista(artistaId);

      console.log(this.artista);
    });

    this.subs.push(sub);
  }

  obtenerArtistas(musica: IMusica) {
    return musica.artistas.map(artista => artista.name).join(', ');
  }

  obtenerArtistaPrincipal(musica: IMusica): string {
    if (musica.artistas.length > 0) {
      return musica.artistas[0].name;
    } else {
      return '';
    }
  }

  verificarAnchoTexto() {
    const artistasContainer = this.elRef.nativeElement.querySelector('.artistas-container');
    const artistas = this.elRef.nativeElement.querySelector('.artistas');

    if (artistas && artistasContainer) {
      const artistasWidth = artistas.getBoundingClientRect().width;
      const containerWidth = artistasContainer.getBoundingClientRect().width;

      if (artistasWidth > containerWidth) {
        artistas.classList.add('anima');
      } else {
        artistas.classList.remove('anima');
      }
    }
  }
}