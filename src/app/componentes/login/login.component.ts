import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SessionService } from '../../../service/session.service';
import { SpotifyService } from '../../../service/spotify.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
errorMessage: any;
username: any = '';
password: any = '';

  constructor(
    private spotify: SpotifyService,
    private router: Router,
    private sessionService: SessionService) { 
      if(this.sessionService.estaLogueado()){
        this.router.navigate(['/inicio']);
    }
  }

  login() {
    
  }


}
