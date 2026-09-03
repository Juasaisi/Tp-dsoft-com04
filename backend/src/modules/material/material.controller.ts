import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialDto } from './dto/material-dto';

@Controller('api/v1/material')
export class MaterialController {
    constructor(private MaterialService:MaterialService){

    }
    @Post('create')
    createMaterial(@Body() material: MaterialDto){
        return this.MaterialService.createMaterial(material)
    }

    @Get('/:idmaterial')
    getmaterialById(@Param('idmaterial')idmaterial:number){
        return this.MaterialService.findMaterial(idmaterial);
    }

    @Get()
    getMaterial(){
        return this.MaterialService.findAll();
    }

    @Put()
    updateMaterial(@Body() material: MaterialDto){
        return this.MaterialService.updateMaterial(material)
    }


}
