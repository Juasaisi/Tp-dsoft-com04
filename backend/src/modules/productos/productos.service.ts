import {Body, ConflictException, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Productos } from './entity/producto.entity';
import { ProductosDto } from './dto/productos-dtos';
import { UpdateResult } from 'typeorm/browser';


@Injectable()
export class ProductosService {
    restoreProducto(id: number) {
        throw new Error('Method not implemented.');
    } 

    constructor(@InjectRepository(Productos) private productosRepository: Repository<Productos> ) {

    }

     async createProducto(producto: ProductosDto) {

      const productoExists = await this.findProducto(producto.id)
      if (productoExists) {
        throw new ConflictException('Producto Existente');

      } else {
        return this.productosRepository.save(producto);

      }
      
    }
    
 async findProducto(id: number){
 return this.productosRepository.findOne({where:{id}})

}
 async findAll(){

   return await this.productosRepository.find({where: {eliminado: false}});
}


 async findAllEliminados(){

   return await this.productosRepository.find({where: {eliminado: true}});
 }

 async updateProducto (producto : ProductosDto) {
   return await this.productosRepository.save(producto);
 }

 async softEliminado(id: number){
    const productoExists = await this.findProducto(id);

    if (!productoExists){
     throw new ConflictException ('el producto con id' + id + 'no existe');

    }
    if (productoExists.eliminado){

       throw new ConflictException ('el producto ya esta eliminado')
    }
  
    const rows : UpdateResult = await this.productosRepository.update({id}, {eliminado : true});

    return rows.affected == 1;
 }
}