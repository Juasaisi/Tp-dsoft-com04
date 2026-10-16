import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
 
// Los nombres de los campos son EXACTAMENTE los de la entidad Productos del back
export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  eliminado?: boolean;
}
 
@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialogComponent],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private apiUrl = 'http://localhost:3000/api/v1/productos';
 
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  productoAEliminar: Producto | null = null; // si tiene valor, se muestra el modal de confirmación
 
  cargando: boolean = false;
  errorMsg: string = '';
  exitoMsg: string = '';
 
  filtroTexto: string = '';
  filtroSoloBajoStock: boolean = false;
 
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  productoForm: Producto = this.productoVacio();
 
  private productoVacio(): Producto {
    return { nombre: '', descripcion: '', precio: 0, stock: 0 };
  }
 
  ngOnInit(): void {
    this.cargarProductos();
  }
 
  cargarProductos(): void {
    this.cargando = true;
    this.errorMsg = '';
 
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => {
        // El back ya devuelve solo los no eliminados; filtramos igual por seguridad
        this.productos = Array.isArray(data) ? data.filter(p => !p.eliminado) : [];
        this.aplicarFiltros();
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.errorMsg = `No se pudo conectar con el backend en ${this.apiUrl}`;
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }
 
  aplicarFiltros(): void {
    const busqueda = (this.filtroTexto || '').trim().toLowerCase();
 
    this.productosFiltrados = this.productos.filter(p => {
      const nom = (p.nombre || '').toLowerCase();
      const desc = (p.descripcion || '').toLowerCase();
 
      const coincideTexto = nom.includes(busqueda) || desc.includes(busqueda);
      const coincideStock = !this.filtroSoloBajoStock || (p.stock ?? 0) <= 5;
 
      return coincideTexto && coincideStock;
    });
  }
 
  abrirCrear(): void {
    this.modoEdicion = false;
    this.productoForm = this.productoVacio();
    this.mostrarFormulario = true;
    this.errorMsg = '';
  }
 
  abrirEditar(p: Producto): void {
    this.modoEdicion = true;
    this.productoForm = { ...p }; // copia, así no se modifica la fila mientras se edita
    this.mostrarFormulario = true;
    this.errorMsg = '';
  }
 
  guardarProducto(): void {
    const nombreFinal = (this.productoForm.nombre || '').trim();
    if (!nombreFinal) {
      alert('El nombre del producto es obligatorio.');
      return;
    }
 
    this.cargando = true;
    this.errorMsg = '';
 
    // Solo los campos que espera ProductosDto del back
    const payload = {
      nombre: nombreFinal,
      descripcion: (this.productoForm.descripcion || '').trim(),
      precio: Number(this.productoForm.precio),
      stock: Number(this.productoForm.stock)
    };
 
    if (this.modoEdicion && this.productoForm.id) {
      this.http.put(`${this.apiUrl}/${this.productoForm.id}`, payload).subscribe({
        next: () => {
          this.mostrarNotificacion('Producto actualizado con éxito');
          this.cerrarFormulario();
          this.cargarProductos();
        },
        error: () => {
          this.errorMsg = 'Error al actualizar el producto.';
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.http.post(this.apiUrl, payload).subscribe({
        next: () => {
          this.mostrarNotificacion('Producto creado con éxito');
          this.cerrarFormulario();
          this.cargarProductos();
        },
        error: () => {
          this.errorMsg = 'Error al guardar el producto.';
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
    }
  }
 
  // Paso 1: el botón "Borrar" solo abre el modal de confirmación
  eliminarProducto(p: Producto): void {
    if (!p.id) return;
    this.productoAEliminar = p;
  }
 
  // Paso 2: si la persona confirma en el modal, recién ahí se borra
  confirmarEliminacion(): void {
    const p = this.productoAEliminar;
    this.productoAEliminar = null;
    if (!p?.id) return;
 
    this.http.delete(`${this.apiUrl}/${p.id}`).subscribe({
      next: () => {
        this.mostrarNotificacion('Producto eliminado.');
        this.cargarProductos();
      },
      error: () => {
        this.errorMsg = 'Error al eliminar el producto.';
        this.cdr.markForCheck();
      }
    });
  }
 
  cancelarEliminacion(): void {
    this.productoAEliminar = null;
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
    setTimeout(() => {
      this.exitoMsg = '';
      this.cdr.markForCheck();
    }, 3000);
  }
}