import {
  Body,
  Controller,
  Get,
  Post,
} from '@nestjs/common';

import { Sale_detailsDto } from './dto/sale_details-dto';
import { SaleDetailsService } from './sale_details.service';

@Controller('api/v1/detalle-venta')
export class SaleDetailsController {
  constructor(
    private saleDetailsService: SaleDetailsService,
  ) {}

  @Post()
  createDetalle(
    @Body() detalleDto: Sale_detailsDto,
  ) {
    return this.saleDetailsService.createDetalle(
      detalleDto,
    );
  }

  @Get()
  getDetalles() {
    return this.saleDetailsService.findAll();
  }
}