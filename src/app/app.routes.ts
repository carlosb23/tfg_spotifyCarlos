import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { sessionGuard } from '../guards/session.guard';

export const routes: Routes = [
    {path: 'login', component:LoginComponent},
    {path: 'main', component:InicioComponent, canActivate: [sessionGuard]},
    {path: '**', redirectTo: 'login', pathMatch: 'full'},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
