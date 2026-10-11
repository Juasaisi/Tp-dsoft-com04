// frontend/src/app/pages/ventas/ventas.component.ts
import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// Interfaces tipadas directamente en el archivo
export interface Cliente {
  idCliente?: number;
  dni: string;
  name?: string;
  nombre?: string;
  surname?: string;
  apellido?: string;
  phone?: string;
  email?: string;
}

export interface Producto {
  idProducto?: number;
  name?: string;
  nombre?: string;
  description?: string;
  price?: number;
  precio?: number;
  stock?: number;
}

export interface DetalleVenta {
  idDetalle?: number;
  product?: Producto;
  producto?: Producto;
  quantity?: number;
  cantidad?: number;
  subtotal?: number;
}

export interface Venta {
  idVenta?: number;
  date?: string;
  fecha?: string;
  total?: number;
  client?: Cliente;
  cliente?: Cliente;
  saleDetails?: DetalleVenta[];
  detalles?: DetalleVenta[];
  delete?: boolean;
}

interface RenglonForm {
  producto: Producto | null;
  cantidad: number;
}

@Component({
  selector: 'app-ventas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.scss'
})
export class VentasComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  private apiUrlVentas = 'http://localhost:3000/api/v1/venta';
  private apiUrlClientes = 'http://localhost:3000/api/v1/Cliente';
  private apiUrlProductos = 'http://localhost:3000/api/v1/productos';

  ventas: Venta[] = [];
  ventasFiltradas: Venta[] = [];
  clientes: Cliente[] = [];
  productos: Producto[] = [];

  ventaSeleccionada: Venta | null = null;
  cargando: boolean = false;
  errorMsg: string = '';
  exitoMsg: string = '';

  // Filtro por fecha (Requisito de regularidad)
  filtroFecha: string = '';

  // Modal para Registrar Venta (Caso de uso principal)
  mostrarFormulario: boolean = false;
  clienteSeleccionadoId: number | null = null;
  renglones: RenglonForm[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMsg = '';

    // 1. Cargar Ventas
    this.http.get<Venta[]>(this.apiUrlVentas).subscribe({
      next: (data) => {
        this.ventas = Array.isArray(data) ? data.filter(v => !v.delete) : [];
        this.aplicarFiltros();
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // Fallback por si la ruta en NestJS está en plural /ventas
        this.http.get<Venta[]>('http://localhost:3000/api/v1/ventas').subscribe({
          next: (data2) => {
            this.apiUrlVentas = 'http://localhost:3000/api/v1/ventas';
            this.ventas = Array.isArray(data2) ? data2.filter(v => !v.delete) : [];
            this.aplicarFiltros();
            this.cargando = false;
            this.cdr.markForCheck();
          },
          error: (err2) => {
            console.error('Error al traer ventas:', err2);
            this.errorMsg = 'No se pudieron cargar las ventas desde el servidor.';
            this.cargando = false;
            this.cdr.markForCheck();
          }
        });
      }
    });

    // 2. Cargar Clientes para el selector
    this.http.get<Cliente[]>(this.apiUrlClientes).subscribe({
      next: (data) => {
        this.clientes = Array.isArray(data) ? data.filter(c => !(c as any).delete) : [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.http.get<Cliente[]>('http://localhost:3000/api/v1/cliente').subscribe({
          next: (data2) => {
            this.clientes = Array.isArray(data2) ? data2.filter(c => !(c as any).delete) : [];
            this.cdr.markForCheck();
          }
        });
      }
    });

    // 3. Cargar Productos con stock disponible
    this.http.get<Producto[]>(this.apiUrlProductos).subscribe({
      next: (data) => {
        this.productos = Array.isArray(data) ? data.filter(p => !(p as any).delete && ((p.stock ?? 0) > 0)) : [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar productos en ventas:', err)
    });
  }

  aplicarFiltros(): void {
    if (!this.filtroFecha) {
      this.ventasFiltradas = [...this.ventas];
      return;
    }
    this.ventasFiltradas = this.ventas.filter(v => {
      const f = (v.date || v.fecha || '').slice(0, 10);
      return f === this.filtroFecha;
    });
  }

  limpiarFiltro(): void {
    this.filtroFecha = '';
    this.ventasFiltradas = [...this.ventas];
    this.cdr.markForCheck();
  }

  abrirCrear(): void {
    this.clienteSeleccionadoId = null;
    this.renglones = [{ producto: null, cantidad: 1 }];
    this.mostrarFormulario = true;
    this.errorMsg = '';
  }

  cerrarFormulario(): void {
    this.mostrarFormulario = false;
  }

  agregarRenglon(): void {
    this.renglones.push({ producto: null, cantidad: 1 });
  }

  eliminarRenglon(index: number): void {
    if (this.renglones.length > 1) {
      this.renglones.splice(index, 1);
    }
  }

  calcularSubtotal(r: RenglonForm): number {
    if (!r.producto) return 0;
    const precio = r.producto.price ?? r.producto.precio ?? 0;
    return precio * (r.cantidad > 0 ? r.cantidad : 0);
  }

  calcularTotalFormulario(): number {
    return this.renglones.reduce((acc, r) => acc + this.calcularSubtotal(r), 0);
  }

  guardarVenta(): void {
    if (!this.clienteSeleccionadoId) {
      alert('Debe seleccionar un cliente.');
      return;
    }

    const renglonesValidos = this.renglones.filter(r => r.producto && r.cantidad > 0);
    if (renglonesValidos.length === 0) {
      alert('Debe cargar al menos una pieza con cantidad válida.');
      return;
    }

    // Validación de stock local previa
    for (const r of renglonesValidos) {
      const stockDisp = r.producto?.stock ?? 0;
      if (r.cantidad > stockDisp) {
        const nom = r.producto?.name || r.producto?.nombre || 'Producto';
        alert(`Stock insuficiente para "${nom}". Disponible: ${stockDisp}`);
        return;
      }
    }

    const payload = {
      clientId: Number(this.clienteSeleccionadoId),
      clienteId: Number(this.clienteSeleccionadoId),
      items: renglonesValidos.map(r => ({
        productId: Number(r.producto?.idProducto),
        productoId: Number(r.producto?.idProducto),
        quantity: Number(r.cantidad),
        cantidad: Number(r.cantidad)
      }))
    };

    this.cargando = true;
    this.errorMsg = '';

    this.http.post(this.apiUrlVentas, payload).subscribe({
      next: () => {
        this.mostrarNotificacion('¡Venta registrada exitosamente!');
        this.cerrarFormulario();
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al registrar venta:', err);
        this.errorMsg = 'Error al registrar la venta en el servidor.';
        this.cargando = false;
        this.cdr.markForCheck();
      }
    });
  }

  verDetalle(v: Venta): void {
    this.ventaSeleccionada = v;
  }

  cerrarDetalle(): void {
    this.ventaSeleccionada = null;
  }

  eliminarVenta(v: Venta): void {
    if (!v.idVenta) return;
    if (confirm(`¿Confirma anular la venta #${v.idVenta}?`)) {
      this.http.delete(`${this.apiUrlVentas}/${v.idVenta}`).subscribe({
        next: () => {
          this.mostrarNotificacion('Venta anulada.');
          this.cargarDatos();
        },
        error: (err) => {
          console.error('Error al anular venta:', err);
          this.errorMsg = 'Error al anular la venta.';
          this.cdr.markForCheck();
        }
      });
    }
  }

  private mostrarNotificacion(msg: string): void {
    this.exitoMsg = msg;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.exitoMsg = '';
      this.cdr.markForCheck();
    }, 3500);
  }
}