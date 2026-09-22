import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductosDto } from './dto/productos-dtos';
import { Productos } from './entity/producto.entity';

@Injectable()
export class ProductosService {
  constructor(
    @InjectRepository(Productos)
    private productosRepository: Repository<Productos>,
  ) {}

  async createProducto(
    productoDto: ProductosDto,
  ): Promise<Productos> {
    const nuevoProducto = this.productosRepository.create({
      nombre: productoDto.nombre,
      descripcion: productoDto.descripcion,
      stock: productoDto.stock,
      precio: productoDto.precio,
      eliminado: false,
    });

    return await this.productosRepository.save(
      nuevoProducto,
    );
  }

  async findProducto(id: number): Promise<Productos> {
    const producto = await this.productosRepository.findOne({
      where: { id },
    });

    if (!producto) {
      throw new NotFoundException(
        `El producto con ID ${id} no existe`,
      );
    }

    return producto;
  }

  async findAll(): Promise<Productos[]> {
    return await this.productosRepository.find({
      where: { eliminado: false },
    });
  }

  async findAllEliminados(): Promise<Productos[]> {
    return await this.productosRepository.find({
      where: { eliminado: true },
    });
  }

  async updateProducto(
    id: number,
    productoDto: ProductosDto,
  ): Promise<Productos> {
    const productoExistente =
      await this.findProducto(id);

    productoExistente.nombre =
      productoDto.nombre;

    productoExistente.descripcion =
      productoDto.descripcion;

    productoExistente.stock =
      productoDto.stock;

    productoExistente.precio =
      productoDto.precio;

    return await this.productosRepository.save(
      productoExistente,
    );
  }

  async softEliminado(id: number): Promise<boolean> {
    const productoExistente =
      await this.findProducto(id);

    if (productoExistente.eliminado) {
      throw new ConflictException(
        `El producto con ID ${id} ya está eliminado`,
      );
    }

    const resultado =
      await this.productosRepository.update(
        { id },
        { eliminado: true },
      );

    return resultado.affected === 1;
  }

  async restoreProducto(id: number): Promise<boolean> {
    const productoExistente =
      await this.findProducto(id);

    if (!productoExistente.eliminado) {
      throw new ConflictException(
        `El producto con ID ${id} no está eliminado`,
      );
    }

    const resultado =
      await this.productosRepository.update(
        { id },
        { eliminado: false },
      );

    return resultado.affected === 1;
  }
}