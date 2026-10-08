// frontend/src/app/pages/clientes/clientes.component.ts
import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

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
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  private http = inject(HttpClient);
  // Ruta exacta como figura en Swagger (C mayúscula)
  private apiUrl = 'http://localhost:3000/api/v1/Cliente';

  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
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

    this.http.get<Cliente[]>(this.apiUrl)
      .pipe(
        // finalize apaga el spinner siempre
        finalize(() => { this.cargando = false; })
      )
      .subscribe({
        next: (data) => {
          this.clientes = Array.isArray(data) ? data.filter(c => !c.delete) : [];
        },
        error: (err) => {
          console.error('Error al cargar clientes:', err);
          this.errorMsg = `No se pudo conectar a ${this.apiUrl}. Verifique que el backend esté activo.`;
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
    if (!this.clienteForm.dni || !this.clienteForm.name || !this.clienteForm.surname) {
      alert('DNI, Nombre y Apellido son obligatorios.');
      return;
    }

    this.cargando = true;
    this.errorMsg = '';

    const payload = {
      dni: this.clienteForm.dni,
      name: this.clienteForm.name,
      nombre: this.clienteForm.name,
      surname: this.clienteForm.surname,
      apellido: this.clienteForm.surname,
      phone: this.clienteForm.phone,
      telefono: this.clienteForm.phone,
      email: this.clienteForm.email
    };

    if (this.modoEdicion && this.clienteForm.idCliente) {
      this.http.put(`${this.apiUrl}/${this.clienteForm.idCliente}`, payload)
        .pipe(finalize(() => { this.cargando = false; }))
        .subscribe({
          next: () => {
            this.mostrarNotificacion('Cliente actualizado correctamente');
            this.cerrarFormulario();
            this.cargarClientes();
          },
          error: () => { this.errorMsg = 'Error al actualizar el cliente.'; }
        });
    } else {
      this.http.post(this.apiUrl, payload)
        .pipe(finalize(() => { this.cargando = false; }))
        .subscribe({
          next: () => {
            this.mostrarNotificacion('Cliente creado con éxito');
            this.cerrarFormulario();
            this.cargarClientes();
          },
          error: () => { this.errorMsg = 'Error al guardar el cliente.'; }
        });
    }
  }

  eliminarCliente(c: Cliente): void {
    if (!c.idCliente) return;
    const nom = `${c.name || c.nombre || ''} ${c.surname || c.apellido || ''}`.trim();
    if (confirm(`¿Confirma eliminar a ${nom || 'este cliente'}?`)) {
      this.http.delete(`${this.apiUrl}/${c.idCliente}`).subscribe({
        next: () => {
          this.mostrarNotificacion('Cliente eliminado.');
          this.cargarClientes();
        },
        error: () => { this.errorMsg = 'Error al eliminar el cliente.'; }
      });
    }
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
    setTimeout(() => (this.exitoMsg = ''), 3000);
  }
}