import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaDto } from './dto/venta-dto';
import { RegistrarVentaDto } from './dto/registrar-venta-dto';

@Controller('api/v1/venta')
export class VentaController {

    constructor(private VentaService: VentaService) {
    }

    // Caso de uso: registrar una venta completa (calcula total y descuenta stock)
    @Post()
    registrarVenta(@Body() dto: RegistrarVentaDto) {
        return this.VentaService.registrarVenta(dto);
    }

    @Post('create')
    createVenta(@Body() venta: VentaDto) {
        return this.VentaService.createVenta(venta);
    }

    @Get('/:idventa')
    getVentaById(@Param('idventa') idventa: number) {
        return this.VentaService.findVenta(idventa);
    }

    @Get()
    getVenta() {
        return this.VentaService.findAll();
    }

    @Put()
    updateVenta(@Body() venta: VentaDto) {
        return this.VentaService.updateVenta(venta);
    }
    @Delete(':idventa')
anularVenta(@Param('idventa', ParseIntPipe) idventa: number) {
  return this.VentaService.anularVenta(idventa);
}
}