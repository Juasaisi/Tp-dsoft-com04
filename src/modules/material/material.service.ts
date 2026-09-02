import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Material } from './entity/material.entity';
import { Repository } from 'typeorm';
import { MaterialDto } from './dto/material-dto';

@Injectable()
export class MaterialService {
    constructor(@InjectRepository(Material) private MaterialRepository:Repository<Material>){

    }

    async createMaterial(material:MaterialDto){
        const materialExist = await this.findMaterial(material.idmaterial)
        if (materialExist){
            throw new ConflictException('Material existente');

        } else{
            return this.MaterialRepository.save(material);
        }
    }
    findMaterial(idmaterial: number) {
        return this.MaterialRepository.findOne({where:{idmaterial}})
    }

    async findAll(){
        return await this.MaterialRepository.find({where:{delete:false}})
    }

    async updateMaterial(material: MaterialDto){
        return await this.MaterialRepository.save(material);
    }
}
