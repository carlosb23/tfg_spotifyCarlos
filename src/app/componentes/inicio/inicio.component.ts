import { Component } from '@angular/core';
import { ParteIzquierdaComponent } from '../../components/parte-izquierda/parte-izquierda.component';
import { BotonMenuComponent } from '../../components/boton-menu/boton-menu.component';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [ParteIzquierdaComponent],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})

export class InicioComponent {

  
}
