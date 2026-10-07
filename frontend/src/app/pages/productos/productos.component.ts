import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Definimos la estructura del producto acá mismo (igual que en Clientes)
export interface Producto {
  id?: number;
  nombre: string;
  descripcion: string;
  stock: number;
  precio: number;
  eliminado?: boolean;
}

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.scss'
})
export class ProductosComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
  private apiUrl = 'http://localhost:3000/api/v1/productos';

  productos: Producto[] = [];
  productoSeleccionado: Producto | null = null;
  cargando: boolean = false;
  errorMsg: string = '';
  exitoMsg: string = '';

  // Control del formulario
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  productoForm: Producto = {
    nombre: '',
    descripcion: '',
    stock: 0,
    precio: 0
  };

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Mostramos solo los que no tengan borrado lógico
        this.productos = data.filter(p => !p.eliminado);
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.errorMsg = this.mensajeDeError(err, 'No se pudieron cargar los productos.');
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  abrirCrear(): void {
    this.modoEdicion = false;
    this.errorMsg = '';
    this.exitoMsg = '';
    this.productoForm = { nombre: '', descripcion: '', stock: 0, precio: 0 };
    this.mostrarFormulario = true;
  }

  abrirEditar(p: Producto): void {
    this.modoEdicion = true;
    this.errorMsg = '';
    this.exitoMsg = '';
    this.productoForm = { ...p };
    this.mostrarFormulario = true;
  }

  guardarProducto(): void {
    this.errorMsg = '';

    if (!this.productoForm.nombre.trim() || !this.productoForm.descripcion.trim()) {
      this.errorMsg = 'Nombre y descripción son obligatorios.';
      return;
    }
    if (!(Number(this.productoForm.precio) > 0)) {
      this.errorMsg = 'El precio debe ser mayor a 0.';
      return;
    }
    if (Number(this.productoForm.stock) < 0) {
      this.errorMsg = 'El stock no puede ser negativo.';
      return;
    }

    // Mandamos solo los 4 datos que acepta el backend (sin id)
    const datos = {
      nombre: this.productoForm.nombre.trim(),
      descripcion: this.productoForm.descripcion.trim(),
      stock: Number(this.productoForm.stock),
      precio: Number(this.productoForm.precio)
    };

    if (this.modoEdicion && this.productoForm.id) {
      // Modificar (PUT)
      this.http.put(`${this.apiUrl}/${this.productoForm.id}`, datos).subscribe({
        next: () => {
          this.exitoMsg = 'Producto actualizado correctamente';
          this.cerrarFormulario();
          this.cargarProductos();
        },
        error: (err) => {
          this.errorMsg = this.mensajeDeError(err, 'Error al actualizar el producto');
          this.cdr.markForCheck();
        }
      });
    } else {
      // Crear nuevo (POST)
      this.http.post(this.apiUrl, datos).subscribe({
        next: () => {
          this.exitoMsg = 'Producto creado con éxito';
          this.cerrarFormulario();
          this.cargarProductos();
        },
        error: (err) => {
          this.errorMsg = this.mensajeDeError(err, 'Error al guardar el producto');
          this.cdr.markForCheck();
        }
      });
    }
  }

  eliminarProducto(p: Producto): void {
    if (!p.id) return;
    if (confirm(`¿Seguro que deseas eliminar "${p.nombre}"?`)) {
      this.http.delete(`${this.apiUrl}/${p.id}`).subscribe({
        next: () => {
          this.exitoMsg = 'Producto eliminado correctamente';
          if (this.productoSeleccionado?.id === p.id) {
            this.productoSeleccionado = null;
          }
          this.cargarProductos();
        },
        error: (err) => {
          this.errorMsg = this.mensajeDeError(err, 'Error al eliminar el producto');
          this.cdr.markForCheck();
        }
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

  // Convierte un error del backend en un texto entendible para la pantalla.
  private mensajeDeError(err: unknown, porDefecto: string): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) {
        return 'No se pudo conectar con el servidor NestJS (verifique que esté corriendo el backend).';
      }
      const mensaje = err.error?.message;
      if (Array.isArray(mensaje)) {
        return mensaje.join(' · ');
      }
      if (typeof mensaje === 'string') {
        return mensaje;
      }
    }
    return porDefecto;
  }
}