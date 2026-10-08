// frontend/src/app/pages/productos/productos.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

export interface Producto {
  idProducto?: number;
  name?: string;
  nombre?: string;
  description?: string;
  descripcion?: string;
  price?: number;
  precio?: number;
  stock?: number;
  delete?: boolean;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/productos';

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productoSeleccionado: Producto | null = null;

  cargando: boolean = false;
  errorMsg: string = '';
  exitoMsg: string = '';

  filtroTexto: string = '';
  filtroSoloBajoStock: boolean = false;

  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  productoForm: any = { name: '', description: '', price: 0, stock: 0 };

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.errorMsg = '';

    this.http.get<Producto[]>(this.apiUrl)
      .pipe(
        // finalize garantiza apagar el spinner ante éxito o error
        finalize(() => { this.cargando = false; })
      )
      .subscribe({
        next: (data) => {
          this.productos = Array.isArray(data) ? data.filter(p => !p.delete) : [];
          this.aplicarFiltros();
        },
        error: (err) => {
          console.error('Error al cargar productos:', err);
          this.errorMsg = `No se pudo conectar con el backend en ${this.apiUrl}`;
        }
      });
  }

  aplicarFiltros(): void {
    const busqueda = (this.filtroTexto || '').trim().toLowerCase();

    this.productosFiltrados = this.productos.filter(p => {
      // Soporta tanto 'name' como 'nombre' sin riesgo de undefined
      const nom = ((p.name ?? p.nombre) || '').toString().toLowerCase();
      const desc = ((p.description ?? p.descripcion) || '').toString().toLowerCase();

      const coincideTexto = nom.includes(busqueda) || desc.includes(busqueda);
      const stockActual = p.stock ?? (p as any).stockActual ?? 0;
      const coincideStock = !this.filtroSoloBajoStock || stockActual <= 5;

      return coincideTexto && coincideStock;
    });
  }

  abrirCrear(): void {
    this.modoEdicion = false;
    this.productoForm = { name: '', description: '', price: 0, stock: 0 };
    this.mostrarFormulario = true;
    this.errorMsg = '';
  }

  abrirEditar(p: Producto): void {
    this.modoEdicion = true;
    this.productoForm = {
      idProducto: p.idProducto,
      name: p.name || p.nombre || '',
      description: p.description || p.descripcion || '',
      price: p.price ?? p.precio ?? 0,
      stock: p.stock ?? 0
    };
    this.mostrarFormulario = true;
    this.errorMsg = '';
  }

  guardarProducto(): void {
    const nombreFinal = (this.productoForm.name || '').trim();
    if (!nombreFinal) {
      alert('El nombre del producto es obligatorio.');
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    const payload = {
      name: nombreFinal,
      nombre: nombreFinal,
      description: this.productoForm.description,
      descripcion: this.productoForm.description,
      price: Number(this.productoForm.price),
      precio: Number(this.productoForm.price),
      stock: Number(this.productoForm.stock)
    };

    if (this.modoEdicion && this.productoForm.idProducto) {
      this.http.put(`${this.apiUrl}/${this.productoForm.idProducto}`, payload)
        .pipe(finalize(() => { this.cargando = false; }))
        .subscribe({
          next: () => {
            this.mostrarNotificacion('Producto actualizado con éxito');
            this.cerrarFormulario();
            this.cargarProductos();
          },
          error: () => { this.errorMsg = 'Error al actualizar el producto.'; }
        });
    } else {
      this.http.post(this.apiUrl, payload)
        .pipe(finalize(() => { this.cargando = false; }))
        .subscribe({
          next: () => {
            this.mostrarNotificacion('Producto creado con éxito');
            this.cerrarFormulario();
            this.cargarProductos();
          },
          error: () => { this.errorMsg = 'Error al guardar el producto.'; }
        });
    }
  }

  eliminarProducto(p: Producto): void {
    if (!p.idProducto) return;
    const nom = p.name || p.nombre || 'este producto';
    if (confirm(`¿Confirma eliminar "${nom}"?`)) {
      this.http.delete(`${this.apiUrl}/${p.idProducto}`).subscribe({
        next: () => {
          this.mostrarNotificacion('Producto eliminado.');
          this.cargarProductos();
        },
        error: () => { this.errorMsg = 'Error al eliminar el producto.'; }
      });
    }
  }

  verDetalle(p: Producto): void {
    this.productoSeleccionado = p;
  }

  cerrarDetalle(): void {
    this.productoSeleccionado = null;
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  private mostrarNotificacion(msg: string): void {
    this.exitoMsg = msg;
    setTimeout(() => (this.exitoMsg = ''), 3000);
  }
}