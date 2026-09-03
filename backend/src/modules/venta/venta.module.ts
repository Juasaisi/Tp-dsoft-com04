import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entity/venta.entity'; 
import { VentaController } from './venta.controller';
import { VentaService } from './venta.service';

@Module({
    imports: [TypeOrmModule.forFeature([Venta])],
    controllers: [VentaController],
    providers: [VentaService],
})
export class VentaModule {}