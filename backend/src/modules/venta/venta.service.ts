import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './entity/venta.entity';
import { VentaDto } from './dto/venta-dto';

@Injectable()
export class VentaService {
  constructor(
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,
  ) {}

  async createVenta(venta: VentaDto) {
    const nuevaVenta = this.ventaRepository.create(venta);
    return this.ventaRepository.save(nuevaVenta);
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