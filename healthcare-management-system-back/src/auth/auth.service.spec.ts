import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
            },
            doctor: {
              create: jest.fn(),
              update: jest.fn(),
            },
            patient: {
              create: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('signup', () => {
    it('should create a user and doctor if role is Doctor', async () => {
      const dto = {
        username: 'doctor',
        email: 'dr@real.com',
        password: 'password',
        role: 'Doctor',
        specialty: 'gym',
        schedule: '9-5',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null); // No email conflict
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce(null); // No username conflict
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      (prisma.user.create as jest.Mock).mockResolvedValue({ id: 1, ...dto });
      (jwtService.sign as jest.Mock).mockReturnValue('jwt-token');

      const result = await service.signup(dto as any);

      expect(prisma.user.create).toHaveBeenCalled();
      expect(prisma.doctor.create).toHaveBeenCalledWith({
        data: { specialty: dto.specialty, schedule: dto.schedule, userId: 1 },
      });
      expect(result).toEqual({ accessToken: 'jwt-token' });
    });

    it('should throw ConflictException if email already exists', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValueOnce({ id: 1 });

      await expect(
        service.signup({ email: 'test@test.com' } as any),
      ).rejects.toThrow(ConflictException);
    });

    it('should throw BadRequestException if patient has no date of birth', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        role: 'Patient',
      });

      await expect(
        service.signup({ email: 'patient@test.com', role: 'Patient' } as any),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid role', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      (prisma.user.create as jest.Mock).mockResolvedValue({
        id: 1,
        role: 'InvalidRole',
      });

      await expect(
        service.signup({ email: 'test@test.com', role: 'InvalidRole' } as any),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('login', () => {
    it('should return JWT token if credentials are valid', async () => {
      const dto = { email: 'test@test.com', password: 'password' };
      const user = {
        id: 1,
        email: dto.email,
        password: 'hashedPassword',
        role: 'Doctor',
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtService.sign as jest.Mock).mockReturnValue('jwt-token');

      const result = await service.login(dto);

      expect(result).toEqual({ accessToken: 'jwt-token' });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(
        service.login({ email: 'fail@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException); /*  */
    });
  });

  describe('getProfile', () => {
    it('should return the correct profile for a doctor', async () => {
      const fakeDoc = {
        id: 1,
        username: 'drstrange',
        email: 'dr@strange.com',
        password: 'hashedPassword', // will be removed
        role: 'Doctor',
        phone: '123456789',
        doctor: {
          specialty: 'Magic',
          schedule: '9-5',
        },
        patient: null,
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(fakeDoc);

      const res = await service.getProfile(1);

      expect(res).toEqual({
        id: 1,
        username: 'drstrange',
        email: 'dr@strange.com',
        role: 'Doctor',
        phone: '123456789',
        specialty: 'Magic',
        schedule: '9-5',
      });
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { doctor: true, patient: true },
      });
    });

    it('should return the correct profile for a patient', async () => {
      const fakePatient = {
        id: 1,
        username: 'patient1',
        email: 'lol@gmial.com',
        password: 'hashedPassword', // will be removed
        role: 'Patient',
        phone: '123456789',
        doctor: null,
        patient: {
          dob: new Date('2000-01-01'),
          address: '123 Main St',
          medicalHistory: 'No history',
        },
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(fakePatient);
      const res = await service.getProfile(1);

      expect(res).toEqual({
        id: 1,
        username: 'patient1',
        email: 'lol@gmial.com',
        role: 'Patient',
        phone: '123456789',
        dob: new Date('2000-01-01'),
        address: '123 Main St',
        medicalHistory: 'No history',
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.getProfile(999)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
