import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

// 1. Interfaces del modelo de datos para Ventas
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
  id?: number; // así se llama el id del producto en el backend
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

// Estructura temporal para cada renglón que agregamos en el formulario
interface RenglonItem {
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

  // Endpoints del backend NestJS
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

  // Filtro por fecha (Requisito de regularidad de la cátedra)
  filtroFecha: string = '';

  // Control del formulario de nueva venta
  mostrarFormulario: boolean = false;
  clienteSeleccionadoId: number | null = null;
  renglones: RenglonItem[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    this.errorMsg = '';

    // 1. Cargar las ventas históricas
    this.http.get<Venta[]>(this.apiUrlVentas).subscribe({
      next: (data) => {
        this.ventas = Array.isArray(data) ? data.filter(v => !v.delete) : [];
        this.aplicarFiltros();
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: () => {
        // Fallback por si la ruta está en plural
        this.http.get<Venta[]>('http://localhost:3000/api/v1/ventas').subscribe({
          next: (dataPlural) => {
            this.apiUrlVentas = 'http://localhost:3000/api/v1/ventas';
            this.ventas = Array.isArray(dataPlural) ? dataPlural.filter(v => !v.delete) : [];
            this.aplicarFiltros();
            this.cargando = false;
            this.cdr.markForCheck();
          },
          error: (err) => {
            console.error('Error al cargar ventas:', err);
            this.errorMsg = 'No se pudieron cargar las ventas desde el servidor.';
            this.cargando = false;
            this.cdr.markForCheck();
          }
        });
      }
    });

    // 2. Cargar Clientes para el desplegable del formulario
    this.http.get<Cliente[]>(this.apiUrlClientes).subscribe({
      next: (data) => {
        this.clientes = Array.isArray(data) ? data.filter(c => !(c as any).delete) : [];
        this.cdr.markForCheck();
      },
      error: () => {
        this.http.get<Cliente[]>('http://localhost:3000/api/v1/cliente').subscribe({
          next: (dataMin) => {
            this.clientes = Array.isArray(dataMin) ? dataMin.filter(c => !(c as any).delete) : [];
            this.cdr.markForCheck();
          }
        });
      }
    });

    // 3. Cargar Productos disponibles para vender (stock > 0)
    this.http.get<Producto[]>(this.apiUrlProductos).subscribe({
      next: (data) => {
        this.productos = Array.isArray(data) ? data.filter(p => !(p as any).delete && ((p.stock ?? 0) > 0)) : [];
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  // Filtro por fecha exacta
  aplicarFiltros(): void {
    if (!this.filtroFecha) {
      this.ventasFiltradas = [...this.ventas];
      return;
    }
    this.ventasFiltradas = this.ventas.filter(v => {
      const fecha = (v.date || v.fecha || '').slice(0, 10);
      return fecha === this.filtroFecha;
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

  calcularSubtotal(r: RenglonItem): number {
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
      alert('Debe seleccionar al menos un producto con cantidad válida.');
      return;
    }

    // Validación de stock
    for (const r of renglonesValidos) {
      const stockDisp = r.producto?.stock ?? 0;
      if (r.cantidad > stockDisp) {
        const nom = r.producto?.name || r.producto?.nombre || 'Producto';
        alert(`Stock insuficiente para "${nom}". Disponible: ${stockDisp}`);
        return;
      }
    }

    // Pedido que espera el backend (POST /api/v1/venta):
    // solo cliente y productos con cantidad. El total y los precios
    // los calcula el servidor.
    const payload = {
      idCliente: Number(this.clienteSeleccionadoId),
      items: renglonesValidos.map(r => ({
        idProducto: Number(r.producto?.id ?? r.producto?.idProducto),
        cantidad: Number(r.cantidad)
      }))
    };

    this.cargando = true;
    this.errorMsg = '';

    this.http.post(this.apiUrlVentas, payload).subscribe({
      next: () => {
        this.mostrarNotificacion('¡Venta registrada con éxito!');
        this.cerrarFormulario();
        this.cargarDatos();
      },
      error: (err) => {
        console.error('Error al registrar venta:', err);
        this.errorMsg = this.mensajeDeError(err, 'Error al registrar la venta en el servidor.');
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

  // Convierte el error que devuelve el backend en un texto para mostrar en pantalla.
  private mensajeDeError(err: unknown, porDefecto: string): string {
    if (err instanceof HttpErrorResponse) {
      // status 0 = ni siquiera llegó al servidor (backend apagado)
      if (err.status === 0) {
        return 'No se pudo conectar con el servidor. Comprobá que el backend esté funcionando.';
      }
      // El backend manda el motivo en "message": un texto o una lista de textos.
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

  private mostrarNotificacion(msg: string): void {
    this.exitoMsg = msg;
    this.cdr.markForCheck();
    setTimeout(() => {
      this.exitoMsg = '';
      this.cdr.markForCheck();
    }, 3500);
  }
}