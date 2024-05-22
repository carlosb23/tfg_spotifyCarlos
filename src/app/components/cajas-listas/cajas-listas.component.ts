import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cajas-listas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cajas-listas.component.html',
  styleUrl: './cajas-listas.component.css'
})
export class CajasListasComponent {

  @Input()
  descripcion = ''
  
  @Input()
  imagenUrl = ''

  @Input()
  selected = false

  @Output()
  click = new EventEmitter<void>();


  onClick() {
    this.click.emit();
  }
}
