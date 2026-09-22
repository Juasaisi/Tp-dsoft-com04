import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ProductosDto } from './dto/productos-dtos';
import { ProductosService } from './productos.service';

@Controller('api/v1/productos')
@ApiTags('Productos')
export class ProductosController {
  constructor(
    private productosService: ProductosService,
  ) {}

  @Post()
  createProducto(
    @Body() productoDto: ProductosDto,
  ) {
    return this.productosService.createProducto(
      productoDto,
    );
  }

  @Get()
  getProductos() {
    return this.productosService.findAll();
  }

  @Get('filter/eliminados')
  getProductosEliminados() {
    return this.productosService.findAllEliminados();
  }

  @Get(':id')
  getProductoById(
    @Param('id', ParseIntPipe) id: number, //La URL siempre llega como texto
  ) {
    return this.productosService.findProducto(id);
  }

  @Put(':id')
  updateProducto(
    @Param('id', ParseIntPipe) id: number,
    @Body() productoDto: ProductosDto,
  ) {
    return this.productosService.updateProducto(
      id,
      productoDto,
    );
  }

  @Delete(':id')
  eliminarProducto(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productosService.softEliminado(id);
  }

  @Patch('restore/:id')
  restoreProducto(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.productosService.restoreProducto(id);
  }
}