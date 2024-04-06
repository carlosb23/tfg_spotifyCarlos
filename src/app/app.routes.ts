import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
//import { AuthGuard } from '../guards/auth.guard';


export const routes: Routes = [
    {path: 'login', component:LoginComponent},
    {path: 'inicio', component:InicioComponent/*, canActivate: [AuthGuard]*/},
    {path: '**', redirectTo: 'login', pathMatch: 'full'},
    {path: '', redirectTo: 'login', pathMatch: 'full'}
];
