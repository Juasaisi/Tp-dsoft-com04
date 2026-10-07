import { Component, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Definimos la estructura del cliente acá mismo
export interface Cliente {
  idCliente?: number;
  dni: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
  delete?: boolean;
}

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/api/v1/Cliente';

  clientes: Cliente[] = [];
  clienteSeleccionado: Cliente | null = null;
  cargando: boolean = false;
  errorMsg: string = '';
  exitoMsg: string = '';

  // Control del formulario
  mostrarFormulario: boolean = false;
  modoEdicion: boolean = false;
  clienteForm: Cliente = {
    dni: '',
    name: '',
    surname: '',
    phone: '',
    email: ''
  };

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.errorMsg = '';
    this.http.get<Cliente[]>(this.apiUrl).subscribe({
      next: (data) => {
        // Filtramos para mostrar los que no tengan borrado lógico
        this.clientes = data.filter(c => !c.delete);
        this.cargando = false;
      },
      error: (err) => {
        this.errorMsg = 'No se pudo conectar con el servidor NestJS (verifique que esté corriendo el backend).';
        this.cargando = false;
      }
    });
  }

  abrirCrear(): void {
    this.modoEdicion = false;
    this.clienteForm = { dni: '', name: '', surname: '', phone: '', email: '' };
    this.mostrarFormulario = true;
  }

  abrirEditar(c: Cliente): void {
    this.modoEdicion = true;
    this.clienteForm = { ...c };
    this.mostrarFormulario = true;
  }

  guardarCliente(): void {
    if (!this.clienteForm.dni || !this.clienteForm.name || !this.clienteForm.surname) {
      alert('DNI, Nombre y Apellido son obligatorios');
      return;
    }

    if (this.modoEdicion && this.clienteForm.idCliente) {
      // Modificar (PUT)
      this.http.put(`${this.apiUrl}/${this.clienteForm.idCliente}`, this.clienteForm).subscribe({
        next: () => {
          this.exitoMsg = 'Cliente actualizado correctamente';
          this.cerrarFormulario();
          this.cargarClientes();
        },
        error: () => alert('Error al actualizar el cliente')
      });
    } else {
      // Crear nuevo (POST)
      this.http.post(this.apiUrl, this.clienteForm).subscribe({
        next: () => {
          this.exitoMsg = 'Cliente creado con éxito';
          this.cerrarFormulario();
          this.cargarClientes();
        },
        error: () => alert('Error al guardar el cliente')
      });
    }
  }

  eliminarCliente(c: Cliente): void {
    if (!c.idCliente) return;
    if (confirm(`¿Seguro que deseas eliminar a ${c.name} ${c.surname}?`)) {
      this.http.delete(`${this.apiUrl}/${c.idCliente}`).subscribe({
        next: () => {
          this.cargarClientes();
        },
        error: () => alert('Error al eliminar cliente')
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
}