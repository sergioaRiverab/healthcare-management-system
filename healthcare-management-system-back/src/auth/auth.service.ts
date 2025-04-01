import { Injectable, UnauthorizedException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
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
      throw new ConflictException('Email already exists.');
    }
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);

    // Crear usuario en la tabla User
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
          name: signupDto.username,
          specialty: "", 
          phone: signupDto.phone ? signupDto.phone.toString() : '',
          schedule: "", 
          userId: user.id
        }
      });
    } else if (signupDto.role === 'Patient') {
      await this.prisma.patient.create({
        data: {
          name: signupDto.username,
          phone: signupDto.phone ? signupDto.phone : '',
          dob: new Date(),
          address: "", 
          medicalHistory: "", 
          userId: user.id
        }
      });
    } else {
      throw new BadRequestException('Invalid role provided.');
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
    throw new UnauthorizedException('Invalid credentials');
  }
}
