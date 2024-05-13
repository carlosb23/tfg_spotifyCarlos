import { Component } from '@angular/core';
import { BuscadorRecientesComponent } from '../buscador-recientes/buscador-recientes.component';
import { CommonModule } from '@angular/common';
import { VistaSonandoComponent } from '../vista-sonando/vista-sonando.component';
import { ReproductorService } from '../../../service/reproductor.service';

@Component({
  selector: 'app-panel-derecho',
  standalone: true,
  imports: [BuscadorRecientesComponent,CommonModule,VistaSonandoComponent],
  templateUrl: './panel-derecho.component.html',
  styleUrl: './panel-derecho.component.css'
})
export class PanelDerechoComponent {

  vistaSonandoHabilitada = false;
  
  constructor(public reproductorService: ReproductorService) { }

  ngOnInit(): void {
    
  }

}
