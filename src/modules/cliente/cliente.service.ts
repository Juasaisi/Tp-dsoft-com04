import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entity/cliente.entity';
import { Repository } from 'typeorm';
import { ClienteDto } from './dto/cliente-dto';
import { UpdateResult } from 'typeorm/browser';
 
@Injectable()
export class ClienteService {

  constructor(@InjectRepository(Cliente) private clienteRepository: Repository<Cliente>) {}

  async createCliente(cliente: ClienteDto) {

    const clienteExists = await this.findCliente(cliente.idCliente);

    if (clienteExists) {
      throw new ConflictException('El cliente con el ID: ' + cliente.idCliente + ' existe');
    } else {
      return await this.clienteRepository.save(cliente);
    }

  }

  async findCliente(idCliente: number) {
    return await this.clienteRepository.findOne({ where: { idCliente } });
  }

  async findAll(){

    return await this.clienteRepository.find({where : {delete:false}})
  }

  async findAllDeleted(){

    return await this.clienteRepository.find({where:{delete: true}});
  
  }

  async updateCliente(cliente: ClienteDto){

    return await this.clienteRepository.save(cliente);
  }
  async deletedCliente(idCliente : number) {

  const clienteExist = await this.findCliente(idCliente);
  if (!clienteExist) {

    throw new ConflictException('El cliente con ID ' + idCliente + ' no existe');

  }
  if (clienteExist.delete) {

    throw new ConflictException('El cliente con ID ' + idCliente + ' ya fue eliminado');

  }

  const rows: UpdateResult= await this.clienteRepository.update({ idCliente }, { delete: true });

  return rows.affected == 1;

}
   async restoreCliente(idCliente: number){ 

        const clienteExist = await this.findCliente(idCliente);

        if(!clienteExist){

            throw new ConflictException ('el cliente con ID' + idCliente + 'no existe');
        }

        if(!clienteExist.delete){

            throw new ConflictException ('el cliente con ID' + idCliente + 'no esta eliminado');
        }

        const rows : UpdateResult= await this.clienteRepository.update({idCliente}, {delete:false});

        return rows.affected==1

            
    }


}