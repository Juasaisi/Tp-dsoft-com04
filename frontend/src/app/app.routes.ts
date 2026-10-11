// frontend/src/app/app.routes.ts
import { Routes } from '@angular/router';
import { ClientesComponent } from './pages/clientes/clientes.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { VentasComponent } from './pages/ventas/ventas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'clientes', pathMatch: 'full' },
  { path: 'clientes', component: ClientesComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'ventas', component: VentasComponent },
  { path: '**', redirectTo: 'clientes' }
];