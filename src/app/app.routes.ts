import { Routes } from '@angular/router';
import { LoginComponent } from './componentes/login/login.component';
import { InicioComponent } from './componentes/inicio/inicio.component';
import { AuthGuard } from '../guards/auth.guard';
import { NgModule } from '@angular/core';


export const routes: Routes = [
    {path: '', redirectTo: 'inicio', pathMatch: 'full'},
    {path: 'login', component:LoginComponent},
    {path: 'inicio', component:InicioComponent, canActivate: [AuthGuard]},
    
];

