import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog.component';
export interface Cliente {
  idCliente?: number;
  dni: string;
  name?: string;
  nombre?: string;
  surname?: string;
  apellido?: string;
  phone?: string;
  telefono?: string;
  email?: string;
  delete?: boolean;
}
 
@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialogComponent],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);
 
  // Intentamos con la ruta estándar
  private apiUrl = 'http://localhost:3000/api/v1/Cliente';
 
  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  clienteAEliminar: Cliente | null = null; // si tiene valor, se muestra el modal de confirmación
  cargando: boolean = false;
  errorMsg: string = '';
  exitoMsg: string = '';
 
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  clienteForm: any = { dni: '', name: '', surname: '', phone: '', email: '' };
 
  ngOnInit(): void {
    this.cargarClientes();
  }
 
  cargarClientes(): void {
    this.cargando = true;
    this.errorMsg = '';
 
    this.http.get<Cliente[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.clientes = Array.isArray(data) ? data.filter(c => !c.delete) : [];
        this.cargando = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.warn('Fallo con /api/v1/Cliente, probando con /api/v1/cliente en minúscula...', err);
        // Fallback automático por si el endpoint está declarado en minúscula
        this.http.get<Cliente[]>('http://localhost:3000/api/v1/cliente').subscribe({
          next: (data2) => {
            this.apiUrl = 'http://localhost:3000/api/v1/cliente';
            this.clientes = Array.isArray(data2) ? data2.filter(c => !c.delete) : [];
            this.cargando = false;
            this.cdr.markForCheck();
          },
          error: (err2) => {
            console.error('Error al cargar clientes:', err2);
            this.errorMsg = 'No se pudo conectar con el endpoint de clientes en NestJS.';
            this.cargando = false;
            this.cdr.markForCheck();
          }
        });
      }
    });
  }
 
  abrirCrear(): void {
    this.modoEdicion = false;
    this.clienteForm = { dni: '', name: '', surname: '', phone: '', email: '' };
    this.mostrarFormulario = true;
    this.errorMsg = '';
  }
 
  abrirEditar(c: Cliente): void {
    this.modoEdicion = true;
    this.clienteForm = {
      idCliente: c.idCliente,
      dni: c.dni,
      name: c.name || c.nombre || '',
      surname: c.surname || c.apellido || '',
      phone: c.phone || c.telefono || '',
      email: c.email || ''
    };
    this.mostrarFormulario = true;
    this.errorMsg = '';
  }
 
  guardarCliente(): void {
    if (!this.clienteForm.dni) {
      alert('El DNI es obligatorio.');
      return;
    }
 
    this.cargando = true;
    this.errorMsg = '';
 
    const payload = {
      dni: this.clienteForm.dni,
      name: this.clienteForm.name || '',
      nombre: this.clienteForm.name || '',
      surname: this.clienteForm.surname || '',
      apellido: this.clienteForm.surname || '',
      phone: this.clienteForm.phone || '',
      telefono: this.clienteForm.phone || '',
      email: this.clienteForm.email || ''
    };
 
    if (this.modoEdicion && this.clienteForm.idCliente) {
      this.http.put(`${this.apiUrl}/${this.clienteForm.idCliente}`, payload).subscribe({
        next: () => {
          this.mostrarNotificacion('Cliente actualizado correctamente');
          this.cerrarFormulario();
          this.cargarClientes();
        },
        error: () => { 
          this.errorMsg = 'Error al actualizar el cliente.'; 
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
    } else {
      this.http.post(this.apiUrl, payload).subscribe({
        next: () => {
          this.mostrarNotificacion('Cliente creado con éxito');
          this.cerrarFormulario();
          this.cargarClientes();
        },
        error: () => { 
          this.errorMsg = 'Error al guardar el cliente.'; 
          this.cargando = false;
          this.cdr.markForCheck();
        }
      });
    }
  }
 
  // Paso 1: el botón "Borrar" solo abre el modal de confirmación
  eliminarCliente(c: Cliente): void {
    if (!c.idCliente) return;
    this.clienteAEliminar = c;
  }
 
  // Paso 2: si la persona confirma en el modal, recién ahí se borra
  confirmarEliminacion(): void {
    const c = this.clienteAEliminar;
    this.clienteAEliminar = null;
    if (!c?.idCliente) return;
 
    this.http.delete(`${this.apiUrl}/${c.idCliente}`).subscribe({
      next: () => {
        this.mostrarNotificacion('Cliente eliminado.');
        this.cargarClientes();
      },
      error: () => {
        this.errorMsg = 'Error al eliminar el cliente.';
        this.cdr.markForCheck();
      }
    });
  }
 
  cancelarEliminacion(): void {
    this.clienteAEliminar = null;
  }
 
  verDetalle(c: Cliente): void {
    this.clienteSeleccionado = c;
  }
 
  cerrarDetalle(): void {
    this.clienteSeleccionado = null;
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