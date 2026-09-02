import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfig } from './config/typeorm.config';
import { ProductosModule } from './modules/productos/productos.module';
import { ClienteModule } from './modules/cliente/cliente.module';
import { MaterialModule } from './modules/material/material.module';
import { VentaModule } from './modules/venta/venta.module';


@Module({
  imports: [ConfigModule.forRoot({isGlobal : true}),
  TypeOrmModule.forRoot(typeOrmConfig),
  ProductosModule,
  ClienteModule,
  MaterialModule,
  VentaModule],
  controllers: [],
  providers: [],
  
})
export class AppModule {}
