import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { AppointmentEntity } from './entities/appointment.entity';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto): Promise<AppointmentEntity> {
    return this.prisma.appointment.create({ data: dto });
  }

  async findAll(): Promise<AppointmentEntity[]> {
    return this.prisma.appointment.findMany();
  }

  async findOne(id: number): Promise<AppointmentEntity> {
    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt) throw new NotFoundException(`Appointment #${id} not found`);
    return appt;
  }

  async update(id: number, dto: UpdateAppointmentDto): Promise<AppointmentEntity> {
    try {
      return await this.prisma.appointment.update({
        where: { id },
        data: dto,
      });
    } catch {
      throw new NotFoundException(`Appointment #${id} not found`);
    }
  }

  async remove(id: number): Promise<AppointmentEntity> {
    try {
      return await this.prisma.appointment.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Appointment #${id} not found`);
    }
  }
}
