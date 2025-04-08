import { Controller, Post, Body, Res, HttpCode, HttpStatus, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtPayload } from './jwt-payload.interface';
import { ApiTags, ApiResponse, ApiOperation, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo usuario' })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente.' })
  @ApiBody({
    description: 'Datos necesarios para registrar un nuevo usuario.',
    schema: {
      example: {
        username: 'DrJuanDavid',
        email: 'jaunDavid.marulanda@gamil.com',
        password: 'Juan*8900',
        role: 'Doctor',
        phone: '3027654567',
        specialty: 'Neurologia',
        schedule: 'Lunes a Viernes 9am-5pm',
      },
    },
  })
  async signup(
    @Body() signupDto: SignupDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken } = await this.authService.signup(signupDto);
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { message: 'usuario registrado exitosamente' };
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Iniciar sesión' })
  @ApiResponse({ status: 200, description: 'Inicio de sesión exitoso.' })
  @ApiBody({
    description: 'Datos necesarios para iniciar sesión.',
    schema: {
      example: {
        email: 'jaunDavid.marulanda@gamil.com',
        password: 'Juan*8900',
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response
  ) {
    const { accessToken } = await this.authService.login(loginDto);
    res.cookie('jwt', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000,
    });
    return { message: 'inicio de sesion exitoso' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Req() req: Request) {
    const userPayload = req.user as JwtPayload;
    const userId = userPayload.sub;
    return this.authService.getProfile(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Editar el perfil del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Perfil actualizado exitosamente.' })
  @ApiBody({
    description: 'Datos necesarios para actualizar el perfil del usuario.',
    schema: {
      example: {
        username: 'DrJuanDavidUpdate',
        specialty: 'Cardiologia',
      },
    },
  })
  async editProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    const userPayload = req.user as JwtPayload;
    const userId = userPayload.sub;
    return this.authService.editProfile(userId, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    const userPayload = req.user as JwtPayload;
    const userId = userPayload.sub;
    return this.authService.editProfile(userId, updateProfileDto);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cambiar la contraseña del usuario autenticado' })
  @ApiResponse({ status: 200, description: 'Contraseña actualizada exitosamente.' })
  @ApiBody({
    description: 'Datos necesarios para cambiar la contraseña.',
    schema: {
      example: {
        oldPassword: 'Juan*8900',
        newPassword: 'Juan*89005',
      },
    },
  })
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    console.log('Authenticated User:', req.user);
    console.log('Change Password Request Body:', changePasswordDto);
    const userPayload = req.user as JwtPayload;
    const userId = userPayload.sub;
    return this.authService.changePassword(userId, changePasswordDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Sesion cerrada exitosamente' };
  }

}