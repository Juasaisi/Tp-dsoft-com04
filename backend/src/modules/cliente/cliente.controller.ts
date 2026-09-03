import { Body, Controller, Get, Param, Post, Delete, Patch, Put } from '@nestjs/common';
import { ClienteService } from './cliente.service';
import { ApiTags } from '@nestjs/swagger';
import { ClienteDto } from './dto/cliente-dto';
import { Cliente } from './entity/cliente.entity';

@Controller('api/v1/Cliente')
@ApiTags('Cliente')
export class ClienteController {

  constructor(private clienteService: ClienteService) {}

  @Post()
  createCliente(@Body() Cliente: ClienteDto) {
    return this.clienteService.createCliente(Cliente);
  }

  @Get('/:idCliente')
  getClienteById(@Param('idCliente') idCliente: number) {
    return this.clienteService.findCliente(idCliente);
  }

  @Get()
  getClientes() {
    return this.clienteService.findAll();
  }

  @Get('/filter/deleted')
  getClientesDeleted(){

    return this.clienteService.findAllDeleted();
     
  }

  @Put()
  updateCliente(@Body() cliente: ClienteDto){

    return this.clienteService.updateCliente(cliente);

  }

  @Delete('/:idCliente')
 deletedCliente(@Param('idCliente') idCliente: number) {

  return this.clienteService.deletedCliente(idCliente);

}

@Patch('/restore/idclient')
restoreClient(@Param('idClient') idCliente : number){

    return this.clienteService.restoreCliente(idCliente);
}
 

}