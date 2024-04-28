import { Component } from '@angular/core';
import { Top50ubiComponent } from '../../components/top50ubi/top50ubi.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Top50ubiComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
