import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';

import { Sale_detailsDto } from './dto/sale_details-dto';
import { SaleDetailsService } from './sale_details.service';
import { UpdateSaleDetailsDto } from './dto/update-sale-details-dto';

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
  @Patch(':id')
updateDetalle(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateSaleDetailsDto,
) {
  return this.saleDetailsService.updateDetalle(id, dto);
}
@Delete(':id')
deleteDetalle(@Param('id', ParseIntPipe) id: number) {
  return this.saleDetailsService.deleteDetalle(id);
}
}