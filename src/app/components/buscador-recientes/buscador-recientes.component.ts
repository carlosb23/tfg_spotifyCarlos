import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscador-recientes',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './buscador-recientes.component.html',
  styleUrl: './buscador-recientes.component.css'
})
export class BuscadorRecientesComponent {
  buscarRecientes = [
    'Top Global','Top 50 España', 'Bad Bunny', 'Saiko', 'Myke Tower'
  ]

  buscador = 'Quevedo';


  definirbuscador(buscador:string){
    this.buscador = buscador;
  }

  buscar(){
    
  }
}

