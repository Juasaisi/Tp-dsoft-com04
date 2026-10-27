import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private http = inject(HttpClient);

  registrarVenta(apiUrl: string, payload: {
    idCliente: number;
    items: {
      idProducto: number;
      cantidad: number;
    }[];
  }) {
    return this.http.post(apiUrl, payload);
  }
}