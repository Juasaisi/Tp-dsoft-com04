import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { RegistroDto } from './dto/registro.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
  ) {}

  @Post('register')
  register(@Body() registro: RegistroDto) {
    return this.authService.register(registro);
  }

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() request: any) {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() request: any) {
    return request.user;
  }
}