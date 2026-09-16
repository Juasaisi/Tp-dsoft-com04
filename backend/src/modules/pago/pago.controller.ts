import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { PagoService } from './pago.service';
import { PagoDto } from './dto/pago.dto';

@Controller('pago')
export class PagoController {   constructor(private pagoService: PagoService) {}

@Post()
createPago(@Body() pago: PagoDto) {
    return this.pagoService.createPago(pago);
}
@Get()
getPagos() { 
    return this.pagoService.findAll();
}

@Get('/filter/deleted')
getPagosDeleted() {
    return this.pagoService.findAllDeleted();
  }

  @Get('/:idPago')
  getPagoById(@Param('idPago') idPago: number) {
    return this.pagoService.findPago(idPago);
  }

  @Put()
  updatePago(@Body() pago: PagoDto) {
    return this.pagoService.updatePago(pago);
  }

  @Delete('/:idPago')
  deletedPago(@Param('idPago') idPago: number) {
    return this.pagoService.deletedPago(idPago);
  }

  @Patch('/restore/:idPago')
  restorePago(@Param('idPago') idPago: number) {
    return this.pagoService.restorePago(idPago);
  }
}
