import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Sale_detailsDto } from './dto/sale_details-dto';
import { Sale_details } from './entity/sale_details.entity';
import { Venta } from '../venta/entity/venta.entity';
import { Productos } from '../productos/entity/producto.entity';
import { UpdateSaleDetailsDto } from './dto/update-sale-details-dto';

@Injectable()
export class SaleDetailsService {
constructor(
  @InjectRepository(Sale_details)
  private detalleRepository: Repository<Sale_details>,

  @InjectRepository(Venta)
  private ventaRepository: Repository<Venta>,

  @InjectRepository(Productos)
  private productoRepository: Repository<Productos>,

  private dataSource: DataSource,
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
  async updateDetalle(id: number, dto: UpdateSaleDetailsDto) {
  return this.dataSource.transaction(async (manager) => {
    const detalle = await manager.findOne(Sale_details, {
      where: { idsale_d: id },
      relations: { venta: true, producto: true },
    });

    if (!detalle) {
      throw new NotFoundException('Detalle de venta no encontrado');
    }

    if (detalle.venta.delete) {
      throw new ConflictException('No se puede modificar una venta eliminada');
    }

    const diferencia = dto.cantidad - detalle.cantidad;

    if (diferencia > 0 && detalle.producto.stock < diferencia) {
      throw new BadRequestException('Stock insuficiente');
    }

    detalle.producto.stock -= diferencia;

    const subtotalAnterior = Number(detalle.subtotal);
    detalle.cantidad = dto.cantidad;
    detalle.subtotal = Number(detalle.preciounitario) * dto.cantidad;

    detalle.venta.total =
      Number(detalle.venta.total) -
      subtotalAnterior +
      detalle.subtotal;

    await manager.save(detalle.producto);
    await manager.save(detalle.venta);
    await manager.save(detalle);

    return detalle;
  });
}
async deleteDetalle(id: number) {
  return this.dataSource.transaction(async (manager) => {
    const detalle = await manager.findOne(Sale_details, {
      where: { idsale_d: id },
      relations: { venta: true, producto: true },
    });

    if (!detalle) {
      throw new NotFoundException('Detalle de venta no encontrado');
    }

    if (detalle.venta.delete) {
      throw new ConflictException(
        'No se puede modificar una venta eliminada',
      );
    }

    // Devolvemos al stock las unidades del detalle.
    detalle.producto.stock += detalle.cantidad;

    // Restamos el subtotal del total de la venta.
    detalle.venta.total =
      Number(detalle.venta.total) - Number(detalle.subtotal);

    await manager.save(detalle.producto);
    await manager.save(detalle.venta);
    await manager.remove(detalle);

    return { mensaje: 'Detalle eliminado correctamente' };
  });
}
}