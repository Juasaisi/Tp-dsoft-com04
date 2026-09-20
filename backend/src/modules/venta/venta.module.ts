import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Venta } from './entity/venta.entity'; 
import { VentaController } from './venta.controller';
import { VentaService } from './venta.service';
import { ClienteModule } from '../cliente/cliente.module';

@Module({
    imports: [TypeOrmModule.forFeature([Venta]), 
    ClienteModule,
],
    controllers: [VentaController],
    providers: [VentaService],
})
export class VentaModule {}