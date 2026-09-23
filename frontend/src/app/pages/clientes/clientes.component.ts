import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';

interface Cliente {
  idCliente: number;
  dni: string;
  name: string;
  surname: string;
  phone: string;
  email: string;
}

@Component({
  selector: 'app-clientes',
  imports: [RouterLink],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss',
})
export class Clientes implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  clientes: Cliente[] = [];
  cargando = true;
  error = '';

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    this.cargando = true;
    this.error = '';

    this.http
      .get<Cliente[]>('http://localhost:3000/api/v1/Cliente')
      .subscribe({
        next: (clientes) => {
          this.clientes = clientes;
          this.cargando = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.error =
            'No se pudieron cargar los clientes. Comprobá que el backend esté funcionando.';
          this.cargando = false;
          this.cdr.markForCheck();
        },
      });
  }
}