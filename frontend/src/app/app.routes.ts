import { Routes } from '@angular/router';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { InicioComponent } from './pages/inicio/inicio.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'clientes', component: ClientesComponent },
  { path: 'productos', component: ProductosComponent },
  // Redirigimos ventas a inicio hasta que creemos el componente de ventas
  { path: 'ventas', redirectTo: 'inicio' },
  { path: '**', redirectTo: 'inicio' }
];