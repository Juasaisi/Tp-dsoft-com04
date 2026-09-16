import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
} from '@nestjs/common';

import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './dto/usuario.dto';

@Controller('usuario')
export class UsuarioController {
  constructor(
    private usuarioService: UsuarioService,
  ) {}

  @Get()
  getUsuarios() {
    return this.usuarioService.findAll();
  }

  @Get('/filter/deleted')
  getUsuariosDeleted() {
    return this.usuarioService.findAllDeleted();
  }

  @Get('/:idUsuario')
  getUsuarioById(
    @Param('idUsuario') idUsuario: number,
  ) {
    return this.usuarioService.findUsuario(idUsuario);
  }

  @Put()
  updateUsuario(
    @Body() usuario: UsuarioDto,
  ) {
    return this.usuarioService.updateUsuario(usuario);
  }

  @Delete('/:idUsuario')
  deletedUsuario(
    @Param('idUsuario') idUsuario: number,
  ) {
    return this.usuarioService.deletedUsuario(idUsuario);
  }

  @Patch('/restore/:idUsuario')
  restoreUsuario(
    @Param('idUsuario') idUsuario: number,
  ) {
    return this.usuarioService.restoreUsuario(idUsuario);
  }
}