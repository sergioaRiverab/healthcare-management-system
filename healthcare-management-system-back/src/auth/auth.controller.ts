import { 
  Controller, Post, Body, Res, HttpCode, HttpStatus, Get, Patch, Req, UseGuards 
} from '@nestjs/common';
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
        username: 'farmacia1',
        email: 'farmacia@mail.com',
        password: 'Farmacia*123',
        role: 'Pharmacy',
        phone: '3027654567',
        // campos de farmacia:
        pharmacyName: 'Farmacia Central',
        pharmacyPhone: '3001234567',
        pharmacyAddress: 'Cra 10 #23-45, Ciudad',
        lat: 4.71000,
        lng: -74.07200
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
        email: 'farmacia@mail.com',
        password: 'Farmacia*123',
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
    return this.authService.getProfile(userPayload.sub);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('profile')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Editar el perfil del usuario autenticado' })
  async editProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto
  ) {
    const userPayload = req.user as JwtPayload;
    return this.authService.editProfile(userPayload.sub, updateProfileDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Cambiar la contraseña del usuario autenticado' })
  async changePassword(
    @Req() req: Request,
    @Body() changePasswordDto: ChangePasswordDto
  ) {
    const userPayload = req.user as JwtPayload;
    return this.authService.changePassword(userPayload.sub, changePasswordDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return { message: 'Sesion cerrada exitosamente' };
  }
}
