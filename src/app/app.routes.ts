import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { auth } from '../guards/auth.guard';
import { HomeComponent } from './componentes/home/home.component';
import { ListaMusicasComponent } from './componentes/lista-musicas/lista-musicas.component';


export const routes: Routes = [
    {path: '', redirectTo: 'inicio', pathMatch: 'full'},
    {path: 'login', component:LoginComponent},
    {path: 'inicio', component:InicioComponent, canActivate: [auth]},
    {path: 'inicio', component:InicioComponent,children:[
        {path: 'home', component:HomeComponent},
        {path: 'lista/:tipo/:id',component: ListaMusicasComponent}
    ]},
    
];

