import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-bannerplaylist',
  standalone: true,
  imports: [],
  templateUrl: './bannerplaylist.component.html',
  styleUrl: './bannerplaylist.component.css'
})
export class BannerplaylistComponent {


  @Input()
  ImagenUrl = '';

  @Input()
  Texto = '';
}
