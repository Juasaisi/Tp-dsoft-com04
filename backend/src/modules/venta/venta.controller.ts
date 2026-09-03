import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { VentaService } from './venta.service';
import { VentaDto } from './dto/venta-dto';

@Controller('api/v1/venta')
export class VentaController {

    constructor(private VentaService: VentaService) {
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
}