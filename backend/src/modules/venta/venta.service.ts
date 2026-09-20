import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entity/venta.entity';
import { VentaDto } from './dto/venta-dto';
import { ClienteService } from '../cliente/cliente.service';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
    private clienteService: ClienteService, 
  ) {}

  async createVenta(ventaDto: VentaDto) {
  const cliente = await this.clienteService.findCliente(
    ventaDto.idCliente,
  );

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