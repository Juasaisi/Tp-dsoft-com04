import { Body, Controller, Delete, Get, Param, Post, Put, Patch } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductosService } from './productos.service';
import { ProductosDto } from './dto/productos-dtos';
import { idText } from 'typescript';
import{ getRandomValues } from 'crypto'; 

@Controller('api/v1/productos')
@ApiTags('Productos')
export class ProductosController {
  constructor(private ProductosService:ProductosService) {
}

  @Post('create')
createProducto(@Body() producto: ProductosDto) {
    return this.ProductosService.createProducto(producto)
}

@Get('/:id')
getProductoById(@Param('id')id: number){
    return this.ProductosService.findProducto(id);

}
@Get()
getproductos(){
    return this.ProductosService.findAll();
}

@Get('filter/eliminado')
getProductosEliminado(){

    return this.ProductosService.findAllEliminados();
}

@Put()
updateProducto(@Body() producto: ProductosDto ){

    return this.ProductosService.updateProducto(producto)
}
@Delete('/:id')
eliminarproducto(@Param('id') id : number){
    return this.ProductosService.softEliminado(id);
}
@Patch('restore/:id')
restoreProducto (@Param ('id') id:number){
    return this.ProductosService.restoreProducto(id)
}

}