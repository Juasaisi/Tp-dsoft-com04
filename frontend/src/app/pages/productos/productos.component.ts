import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface Producto {
  idProducto?: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
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

  // Filtros (Requisito de regularidad)
  filtroTexto: string = '';
  filtroSoloBajoStock: boolean = false;

  // Estado del formulario
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  productoForm: Producto = {
    name: '',
    description: '',
    price: 0,
    stock: 0
  };

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.cargando = true;
    this.errorMsg = '';

    this.http.get<Producto[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.productos = Array.isArray(data) ? data.filter(p => !p.delete) : [];
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar productos:', err);
        this.errorMsg = `No se pudo conectar con el backend en ${this.apiUrl}. Verifique que NestJS esté activo.`;
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    const busqueda = this.filtroTexto.trim().toLowerCase();

    this.productosFiltrados = this.productos.filter(p => {
      const coincideTexto = p.name.toLowerCase().includes(busqueda) ||
        (p.description && p.description.toLowerCase().includes(busqueda));

      const coincideStock = !this.filtroSoloBajoStock || p.stock <= 5;

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
    this.productoForm = { ...p };
    this.mostrarFormulario = true;
    this.errorMsg = '';
  }

  guardarProducto(): void {
    if (!this.productoForm.name.trim()) {
      alert('El nombre del producto es obligatorio.');
      return;
    }
    if (this.productoForm.price < 0 || this.productoForm.stock < 0) {
      alert('El precio y el stock deben ser números positivos.');
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    if (this.modoEdicion && this.productoForm.idProducto) {
      // Modificar existente (PUT)
      this.http.put(`${this.apiUrl}/${this.productoForm.idProducto}`, this.productoForm).subscribe({
        next: () => {
          this.mostrarNotificacion('Producto actualizado con éxito');
          this.cerrarFormulario();
          this.cargarProductos();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.errorMsg = 'Error al actualizar el producto en el servidor.';
          this.cargando = false;
        }
      });
    } else {
      // Crear nuevo (POST)
      this.http.post(this.apiUrl, this.productoForm).subscribe({
        next: () => {
          this.mostrarNotificacion('Producto creado con éxito');
          this.cerrarFormulario();
          this.cargarProductos();
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          this.errorMsg = 'Error al guardar el producto en el servidor.';
          this.cargando = false;
        }
      });
    }
  }

  eliminarProducto(p: Producto): void {
    if (!p.idProducto) return;
    if (confirm(`¿Confirma eliminar el producto "${p.name}"?`)) {
      this.http.delete(`${this.apiUrl}/${p.idProducto}`).subscribe({
        next: () => {
          this.mostrarNotificacion('Producto eliminado.');
          this.cargarProductos();
        },
        error: (err) => {
          console.error('Error al eliminar:', err);
          this.errorMsg = 'Error al eliminar el producto.';
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

  private mostrarNotificacion(msg: string): void {
    this.exitoMsg = msg;
    setTimeout(() => (this.exitoMsg = ''), 3000);
  }
}