import { Component } from '@angular/core';
import { BuscadorRecientesComponent } from '../buscador-recientes/buscador-recientes.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-panel-derecho',
  standalone: true,
  imports: [BuscadorRecientesComponent,CommonModule],
  templateUrl: './panel-derecho.component.html',
  styleUrl: './panel-derecho.component.css'
})
export class PanelDerechoComponent {


}
