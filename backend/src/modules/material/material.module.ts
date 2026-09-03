import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Material } from './entity/material.entity';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';

@Module({
    imports: [TypeOrmModule.forFeature([Material])],
    controllers: [MaterialController],
    providers: [MaterialService],

})
export class MaterialModule {}
