import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async signup(signupDto: SignupDto) {
    const existingUser = await this.prisma.user.findUnique({ where: { email: signupDto.email } });
    if (existingUser) {
      throw new ConflictException('el correo electrónico ya existe.');
    }

    const existingUserByUsername = await this.prisma.user.findUnique({ where: { username: signupDto.username } });
    if (existingUserByUsername) {
      throw new ConflictException('el nombre de usuario ya existe.');
    }
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        username: signupDto.username,
        email: signupDto.email,
        password: hashedPassword,
        role: signupDto.role,
        phone: signupDto.phone
      }
    });

    if (signupDto.role === 'Doctor') {
      await this.prisma.doctor.create({
        data: {
          specialty: signupDto.specialty || '',
          schedule: signupDto.schedule || '',
          userId: user.id
        }
      });
    } else if (signupDto.role === 'Patient') {
      if (!signupDto.dob) {
        throw new BadRequestException('La fecha de nacimiento es obligatoria para pacientes.');
      }
      await this.prisma.patient.create({
        data: {
          dob: new Date(signupDto.dob),
          address: signupDto.address || '',
          medicalHistory: signupDto.medicalHistory || '',
          userId: user.id
        }
      });
    } else {
      throw new BadRequestException('Rol inválido proporcionado.');
    }

    const payload = { sub: user.id, role: user.role };
    return { accessToken: this.jwtService.sign(payload) };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email }
    });
    if (user && await bcrypt.compare(loginDto.password, user.password)) {
      const payload = { sub: user.id, role: user.role };
      return { accessToken: this.jwtService.sign(payload) };
    }
    throw new UnauthorizedException('Credenciales inválidas.');
  }

  async getProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        doctor: true,
        patient: true,
      }
    });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }
    const { password, doctor, patient, ...userWithoutPassword } = user;
  
    if (user.role === 'Doctor' && doctor) {
      return {
        ...userWithoutPassword,
        specialty: doctor.specialty,
        schedule: doctor.schedule,
       
      };
    }
    else if (user.role === 'Patient' && patient) {
      return {
        ...userWithoutPassword,
        dob: patient.dob,
        address: patient.address,
        medicalHistory: patient.medicalHistory,
      };
    }
  
    return userWithoutPassword;
  }
  

  async editProfile(userId: number, updateProfileDto: UpdateProfileDto) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        username: updateProfileDto.username,
        email: updateProfileDto.email,
        phone: updateProfileDto.phone,
      }
    });

    if (user.role === 'Doctor') {
      await this.prisma.doctor.update({
        where: { userId: userId },
        data: {
          specialty: updateProfileDto.specialty,
          schedule: updateProfileDto.schedule,
        }
      });
    } else if (user.role === 'Patient') {
      await this.prisma.patient.update({
        where: { userId: userId },
        data: {
          dob: updateProfileDto.dob ? new Date(updateProfileDto.dob) : undefined,
          address: updateProfileDto.address,
          medicalHistory: updateProfileDto.medicalHistory,
        }
      });
    }
    const { password, ...userWithoutPassword } = user;
    return { message: 'Perfil actualizado exitosamente', user: userWithoutPassword };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user || !(await bcrypt.compare(changePasswordDto.oldPassword, user.password))) {
      throw new UnauthorizedException('La contraseña actual es incorrecta.');
    }
    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
    return { message: 'Contraseña actualizada exitosamente' };
  }
}
