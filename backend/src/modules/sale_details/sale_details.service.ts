import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Sale_detailsDto } from './dto/sale_details-dto';
import { Sale_details } from './entity/sale_details.entity';
import { Venta } from '../venta/entity/venta.entity';
import { Productos } from '../productos/entity/producto.entity';

@Injectable()
export class SaleDetailsService {
  constructor(
    @InjectRepository(Sale_details)
    private detalleRepository: Repository<Sale_details>,

    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,

    @InjectRepository(Productos)
    private productoRepository: Repository<Productos>,
  ) {}

  async createDetalle(detalleDto: Sale_detailsDto) {
    const venta = await this.ventaRepository.findOne({
      where: {
        idventa: detalleDto.idVenta,
      },
    });

    if (!venta) {
      throw new NotFoundException(
        `La venta con ID ${detalleDto.idVenta} no existe`,
      );
    }

    const producto = await this.productoRepository.findOne({
      where: {
        id: detalleDto.idProducto,
      },
    });

    if (!producto) {
      throw new NotFoundException(
        `El producto con ID ${detalleDto.idProducto} no existe`,
      );
    }

    if (producto.eliminado) {
      throw new BadRequestException(
        'No se puede vender un producto eliminado',
      );
    }

    if (producto.stock < detalleDto.cantidad) {
      throw new BadRequestException(
        `Stock insuficiente. Disponible: ${producto.stock}`,
      );
    }

    const precioUnitario = Number(producto.precio);
    const subtotal =
      precioUnitario * detalleDto.cantidad;

    const nuevoDetalle =
      this.detalleRepository.create({
        cantidad: detalleDto.cantidad,
        preciounitario: precioUnitario,
        subtotal,
        venta,
        producto,
      });

    producto.stock -= detalleDto.cantidad;

    await this.productoRepository.save(producto);

    return await this.detalleRepository.save(
      nuevoDetalle,
    );
  }

  async findAll() {
    return await this.detalleRepository.find({
      relations: {
        venta: true,
        producto: true,
      },
    });
  }
}