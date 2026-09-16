import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  UpdateResult,
} from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Usuario } from './entity/usuario.entity';
import { UsuarioDto } from './dto/usuario.dto';
import { RegistroDto } from '../../auth/dto/registro.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
  ) {}

  async findByEmail(
    email: string,
  ): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { email },
    });
  }

  async createUsuario(
    registro: RegistroDto,
  ): Promise<Usuario> {
    const usuarioExistente =
      await this.findByEmail(registro.email);

    if (usuarioExistente) {
      throw new ConflictException(
        'El email ya se encuentra registrado',
      );
    }

    const salt = await bcrypt.genSalt(10);

    const passwordHash = await bcrypt.hash(
      registro.password,
      salt,
    );

    const nuevoUsuario =
      this.usuarioRepository.create({
        nombre: registro.nombre,
        email: registro.email,
        passwordHash,
        rol: 'VENDEDOR',
        eliminado: false,
      });

    return await this.usuarioRepository.save(
      nuevoUsuario,
    );
  }

  async validatePassword(
    password: string,
    passwordHash: string,
  ): Promise<boolean> {
    return await bcrypt.compare(
      password,
      passwordHash,
    );
  }

  async findUsuario(
    idUsuario: number,
  ): Promise<Usuario | null> {
    return await this.usuarioRepository.findOne({
      where: { idUsuario },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      where: { eliminado: false },
    });
  }

  async findAllDeleted(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      where: { eliminado: true },
    });
  }

  async updateUsuario(usuario: UsuarioDto) {
    return await this.usuarioRepository.save(usuario);
  }

  async deletedUsuario(
    idUsuario: number,
  ): Promise<boolean> {
    const usuarioExist =
      await this.findUsuario(idUsuario);

    if (!usuarioExist) {
      throw new ConflictException(
        'El usuario con ID ' +
          idUsuario +
          ' no existe',
      );
    }

    if (usuarioExist.eliminado) {
      throw new ConflictException(
        'El usuario con ID ' +
          idUsuario +
          ' ya fue eliminado',
      );
    }

    const rows: UpdateResult =
      await this.usuarioRepository.update(
        { idUsuario },
        { eliminado: true },
      );

    return rows.affected == 1;
  }

  async restoreUsuario(
    idUsuario: number,
  ): Promise<boolean> {
    const usuarioExist =
      await this.findUsuario(idUsuario);

    if (!usuarioExist) {
      throw new ConflictException(
        'El usuario con ID ' +
          idUsuario +
          ' no existe',
      );
    }

    if (!usuarioExist.eliminado) {
      throw new ConflictException(
        'El usuario con ID ' +
          idUsuario +
          ' no está eliminado',
      );
    }

    const rows: UpdateResult =
      await this.usuarioRepository.update(
        { idUsuario },
        { eliminado: false },
      );

    return rows.affected == 1;
  }
}