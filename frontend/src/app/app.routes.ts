import { Routes } from '@angular/router';
import { Clientes } from './pages/clientes/clientes.component';
import { Inicio } from './pages/inicio/inicio.component';

export const routes: Routes = [
  {path: '', component: Inicio },
  { path: 'clientes', component: Clientes },
];