import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Sale_details } from './entity/sale_details.entity';
import { SaleDetailsController } from './sale_details.controller';
import { SaleDetailsService } from './sale_details.service';
import { Productos } from '../productos/entity/producto.entity';
import { Venta } from '../venta/entity/venta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sale_details, Venta, Productos]),
  ],
  controllers: [SaleDetailsController],
  providers: [SaleDetailsService],
  exports: [SaleDetailsService],
})
export class SaleDetailsModule {}
