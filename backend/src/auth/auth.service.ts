import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsuarioService } from '../modules/usuario/usuario.service';
import { RegistroDto } from './dto/registro.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUsuario(
    email: string,
    password: string,
  ) {
    const usuario =
      await this.usuarioService.findByEmail(email);

    if (!usuario || usuario.eliminado) {
      return null;
    }

    const passwordValida =
      await this.usuarioService.validatePassword(
            password,
            usuario.passwordHash,
        );

    if (!passwordValida) {
      return null;
    }

    const { passwordHash, ...resultado } = usuario;

    return resultado;
  }

  async register(registro: RegistroDto) {
    const usuario =
      await this.usuarioService.createUsuario(registro);

    const { passwordHash, ...resultado } = usuario;

    return resultado;
  }

  async login(usuario: {
    idUsuario: number;
    email: string;
    rol: string;
  }) {
    const payload = {
      sub: usuario.idUsuario,
      email: usuario.email,
      rol: usuario.rol,
    };

    return {
      access_token:
        await this.jwtService.signAsync(payload),
    };
  }
}