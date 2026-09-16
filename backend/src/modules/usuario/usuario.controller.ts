import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioDto } from './dto/usuario.dto';

@Controller('usuario')
export class UsuarioController {

    constructor(private usuarioService: UsuarioService){}
    @Post()
    createusuario(@Body() Usuario:UsuarioDto){
        return this.usuarioService.createUsuario(Usuario);
    }
    @Get('/:idUsuario')
    getUsuarioById(@Param('idUsuario') idUsuario: number) {
    return this.usuarioService.findUsuario(idUsuario);
  }

  @Get()
  getUsuarios() {
    return this.usuarioService.findAll();
  }

  @Get('/filter/deleted')
  getUsuariosDeleted() {
    return this.usuarioService.findAllDeleted();
  }

  @Put()
  updateUsuario(@Body() usuario: UsuarioDto) {
    return this.usuarioService.updateUsuario(usuario);
  }

  @Delete('/:idUsuario')
  deletedUsuario(@Param('idUsuario') idUsuario: number) {
    return this.usuarioService.deletedUsuario(idUsuario);
  }

  @Patch('/restore/idusuario')
  restoreUsuario(@Param('idUsuario') idUsuario: number) {
    return this.usuarioService.restoreUsuario(idUsuario);
  }


}
