import { Module } from '@nestjs/common';
import { ClienteService } from  './cliente.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClienteController } from './cliente.controller';
import { Cliente } from './entity/cliente.entity';


@Module({

    imports: [TypeOrmModule.forFeature([Cliente])],
    controllers: [ClienteController],
    providers: [ClienteService]

})
export class ClienteModule {}
