import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, NgModule, Output } from '@angular/core';

@Component({
  selector: 'app-boton-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boton-menu.component.html',
  styleUrl: './boton-menu.component.css'
})
export class BotonMenuComponent {

  
  @Input()
  descripcion = ''
  imgUrl = ''

  @Input()
  selected = false

  @Output()
  click = new EventEmitter<void>();


  onClick() {
    this.click.emit();
  }
}
