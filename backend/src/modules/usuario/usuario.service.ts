import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entity/usuario.entity';
import { Repository } from 'typeorm';
import { UsuarioDto } from './dto/usuario.dto';

@Injectable()
export class UsuarioService {

    constructor(@InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>){}
    async createUsuario (usuarioDto: Usuario){
        const usuarioExist = await this.findUsuario(usuarioDto.idUsuario);
        if (usuarioExist){
            throw new ConflictException('El usuario con el id ' + usuarioDto.idUsuario + 'existe');
        } else {
            return await this.usuarioRepository.save(usuarioDto);
        }

    }
    async findUsuario(idUsuario: number){
        const usuario = await this.usuarioRepository.findOne({where: idUsuario }); 
    }
      async findAll() {

    return await this.usuarioRepository.find({
      where: { eliminado: false }
    });

  }

  async findAllDeleted() {

    return await this.usuarioRepository.find({
      where: { eliminado: true }
    });

  }

  async updateUsuario(usuario: UsuarioDto) {

    return await this.usuarioRepository.save(usuario);

  }

  async deletedUsuario(idUsuario: number) {

    const usuarioExist = await this.findUsuario(idUsuario);

    if (!usuarioExist) {

      throw new ConflictException(
        'El usuario con ID ' + idUsuario + ' no existe'
      );

    }

    if (usuarioExist.eliminado) {

      throw new ConflictException(
        'El usuario con ID ' + idUsuario + ' ya fue eliminado'
      );

    }

    const rows: UpdateResult =
      await this.usuarioRepository.update(
        { idUsuario },
        { eliminado: true }
      );

    return rows.affected == 1;

  }

  async restoreUsuario(idUsuario: number) {

    const usuarioExist = await this.findUsuario(idUsuario);

    if (!usuarioExist) {

      throw new ConflictException(
        'El usuario con ID ' + idUsuario + ' no existe'
      );

    }

    if (!usuarioExist.eliminado) {

      throw new ConflictException(
        'El usuario con ID ' + idUsuario + ' no esta eliminado'
      );

    }

    const rows: UpdateResult =
      await this.usuarioRepository.update(
        { idUsuario },
        { eliminado: false }
      );

    return rows.affected == 1;

  }


    

}
