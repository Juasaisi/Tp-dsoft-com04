import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Venta } from './entity/venta.entity';
import { VentaDto } from './dto/venta-dto';
import { RegistrarVentaDto } from './dto/registrar-venta-dto';
import { ClienteService } from '../cliente/cliente.service';
import { Productos } from '../productos/entity/producto.entity';
import { Sale_details } from '../sale_details/entity/sale_details.entity';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    private clienteService: ClienteService,
    private dataSource: DataSource,
  ) {}

  // CASO DE USO: registrar una venta completa.
  // Calcula el total, descuenta el stock y guarda venta + detalles,
  // todo junto: si algo falla, no se guarda nada.
  async registrarVenta(dto: RegistrarVentaDto) {
    // 1. El cliente tiene que existir y no estar eliminado.
    const cliente = await this.clienteService.findCliente(dto.idCliente);
    if (!cliente) {
      throw new NotFoundException(`El cliente con ID ${dto.idCliente} no existe`);
    }
    if (cliente.delete) {
      throw new ConflictException(`El cliente con ID ${dto.idCliente} está eliminado`);
    }

    // 2. Si el mismo producto viene en dos renglones, se suman las cantidades.
    const cantidades = new Map<number, number>();
    for (const item of dto.items) {
      cantidades.set(
        item.idProducto,
        (cantidades.get(item.idProducto) ?? 0) + item.cantidad,
      );
    }

    // 3. Si no mandan fecha, usamos la de hoy (formato AAAA-MM-DD).
    const fecha = dto.fecha ?? new Date().toLocaleDateString('en-CA');

    // 4. Transacción: o se hace todo, o no se hace nada.
    return this.dataSource.transaction(async (manager) => {
      let total = 0;
      const detalles: Sale_details[] = [];

      for (const [idProducto, cantidad] of cantidades) {
        const producto = await manager.findOne(Productos, {
          where: { id: idProducto },
        });

        if (!producto) {
          throw new NotFoundException(`El producto con ID ${idProducto} no existe`);
        }
        if (producto.eliminado) {
          throw new BadRequestException(`El producto "${producto.nombre}" está eliminado`);
        }
        if (producto.stock < cantidad) {
          throw new BadRequestException(
            `Stock insuficiente de "${producto.nombre}". Disponible: ${producto.stock}`,
          );
        }

        // El precio sale de la base de datos, nunca de lo que mande el cliente.
        const precioUnitario = Number(producto.precio);
        const subtotal = precioUnitario * cantidad;
        total += subtotal;

        // Descontamos el stock.
        producto.stock -= cantidad;
        await manager.save(producto);

        detalles.push(
          manager.create(Sale_details, {
            cantidad,
            preciounitario: precioUnitario,
            subtotal,
            producto,
          }),
        );
      }

      // Guardamos la venta con el total ya calculado.
      const venta = await manager.save(
        manager.create(Venta, { fecha, total, delete: false, cliente }),
      );

      // Y cada detalle, vinculado a la venta.
      for (const detalle of detalles) {
        detalle.venta = venta;
      }
      await manager.save(detalles);

      return { idventa: venta.idventa, fecha: venta.fecha, total: venta.total };
    });
  }

  async createVenta(ventaDto: VentaDto) {
    const cliente = await this.clienteService.findCliente(ventaDto.idCliente);

    if (!cliente) {
      throw new NotFoundException(
        `El cliente con ID ${ventaDto.idCliente} no existe`,
      );
    }

    if (cliente.delete) {
      throw new ConflictException(
        `El cliente con ID ${ventaDto.idCliente} está eliminado`,
      );
    }

    const nuevaVenta = this.ventaRepository.create({
      fecha: ventaDto.fecha,
      total: ventaDto.total,
      delete: false,
      cliente: cliente,
    });

    return await this.ventaRepository.save(nuevaVenta);
  }

  async findVenta(idventa: number) {
    const venta = await this.ventaRepository.findOneBy({ idventa: idventa });
    if (!venta) {
      throw new NotFoundException('Venta no encontrada');
    }
    return venta;
  }

  async findAll() {
    return this.ventaRepository.find();
  }

  async updateVenta(venta: VentaDto) {
    return this.ventaRepository.save(venta);
  }
}