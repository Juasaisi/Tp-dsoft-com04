import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cliente } from './entity/cliente.entity';
import { Repository } from 'typeorm';
import { ClienteDto } from './dto/cliente-dto';
import { UpdateResult } from 'typeorm/browser';
 
@Injectable()
export class ClienteService {

  constructor(@InjectRepository(Cliente) private clienteRepository: Repository<Cliente>) {}

  async createCliente(
  clienteDto: ClienteDto,
): Promise<Cliente> {
  const clienteConMismoDni =
    await this.clienteRepository.findOne({
      where: {
        dni: clienteDto.dni,
      },
    });

  if (clienteConMismoDni) {
    throw new ConflictException(
      `Ya existe un cliente con el DNI ${clienteDto.dni}`,
    );
  }

  const clienteConMismoEmail =
    await this.clienteRepository.findOne({
      where: {
        email: clienteDto.email,
      },
    });

  if (clienteConMismoEmail) {
    throw new ConflictException(
      `Ya existe un cliente con el email ${clienteDto.email}`,
    );
  }

  const nuevoCliente =
    this.clienteRepository.create({
      dni: clienteDto.dni,
      name: clienteDto.name,
      surname: clienteDto.surname,
      phone: clienteDto.phone,
      email: clienteDto.email,
      delete: false,
    });

  return await this.clienteRepository.save(
    nuevoCliente,
  );
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

  async updateCliente(idCliente: number, datos: ClienteDto) {
    const cliente = await this.findCliente(idCliente);

    if (!cliente || cliente.delete) {
      throw new ConflictException('El cliente no existe o está dado de baja');
    }

    Object.assign(cliente, datos);
    return this.clienteRepository.save(cliente);
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