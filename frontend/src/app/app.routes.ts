import { Routes } from '@angular/router';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { Inicio } from './pages/inicio/inicio.component';
import { ProductosComponent } from './pages/productos/productos.component';

export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'clientes', component: ClientesComponent },
  { path: 'productos', component: ProductosComponent },
];