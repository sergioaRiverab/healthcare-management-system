import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async signup(signupDto: SignupDto) {
    // chequear email y username
    if (await this.prisma.user.findUnique({ where: { email: signupDto.email } }))
      throw new ConflictException('El correo electrónico ya existe.');

    if (await this.prisma.user.findUnique({ where: { username: signupDto.username } }))
      throw new ConflictException('El nombre de usuario ya existe.');

    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        username: signupDto.username,
        email:    signupDto.email,
        password: hashedPassword,
        role:     signupDto.role,
        phone:    signupDto.phone,
      },
    });

    if (signupDto.role === 'Patient') {
      if (!signupDto.dob) throw new BadRequestException('DOB es obligatorio.');
      await this.prisma.patient.create({
        data: {
          dob:            new Date(signupDto.dob),
          address:        signupDto.address || '',
          userId:         user.id,
        },
      });
    } else if (signupDto.role === 'Pharmacy') {
      console.log('signupDto:  ', signupDto);
      // validar campos de farmacia
      if ( !signupDto.lat || !signupDto.lng)
        throw new BadRequestException('Todos los datos de farmacia son obligatorios.');
      await this.prisma.pharmacy.create({
        data: {
          address: signupDto.address || '',
          lat:     signupDto.lat,
          lng:     signupDto.lng,
          userId:  user.id,
        },
      });
    } else {
      throw new BadRequestException('Rol inválido.');
    }

    const payload = { sub: user.id, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: loginDto.email } });
    if (user && await bcrypt.compare(loginDto.password, user.password)) {
      const payload = { sub: user.id, role: user.role };
      return { accessToken: this.jwtService.sign(payload) };
    }
    throw new UnauthorizedException('Credenciales inválidas.');
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { patient: true, pharmacy: true },
    });
    if (!user) throw new UnauthorizedException('Usuario no encontrado.');

    const { password, patient, pharmacy, ...rest } = user;
    if (user.role === 'Patient' && patient) {
      return {
        ...rest,
        dob:            patient.dob,
        address:        patient.address,
      };
    }
    if (user.role === 'Pharmacy' && pharmacy) {
      return {
        ...rest,
        pharmacyAddress: pharmacy.address,
        lat:             pharmacy.lat,
        lng:             pharmacy.lng,
      };
    }
    return rest;
  }

  async editProfile(userId: number, dto: UpdateProfileDto) {
    const updatedUser = await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: dto.username || undefined,
        email:    dto.email    || undefined,
        phone:    dto.phone    || undefined,
      },
    });

    if (updatedUser.role === 'Patient') {
      await this.prisma.patient.update({
        where: { userId },
        data: {
          dob:            dto.dob ? new Date(dto.dob) : undefined,
          address:        dto.address,
        },
      });
    }
    if (updatedUser.role === 'Pharmacy') {
      await this.prisma.pharmacy.update({
        where: { userId },
        data: {
          address: dto.pharmacyAddress,
          lat:     dto.lat,
          lng:     dto.lng,
        },
      });
    }

    const { password, ...rest } = updatedUser;
    return { message: 'Perfil actualizado exitosamente', user: rest };
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(dto.oldPassword, user.password)))
      throw new UnauthorizedException('La contraseña actual es incorrecta.');

    const hashed = await bcrypt.hash(dto.newPassword, 10);
    await this.prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    return { message: 'Contraseña actualizada exitosamente' };
  }
}
