import { Component } from '@angular/core';
import { ParteIzquierdaComponent } from '../../components/parte-izquierda/parte-izquierda.component';
import { RouterOutlet } from '@angular/router';
import { Top50ubiComponent } from '../../components/top50ubi/top50ubi.component';



@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ParteIzquierdaComponent,RouterOutlet,Top50ubiComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent {

  
}
