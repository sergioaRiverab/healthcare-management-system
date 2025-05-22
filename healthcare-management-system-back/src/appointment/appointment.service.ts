import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAppointmentDto) {
    return this.prisma.appointment.create({ data: dto });
  }

  async findAll() {
    return this.prisma.appointment.findMany();
  }

  async findOne(id: number) {
    const appt = await this.prisma.appointment.findUnique({ where: { id } });
    if (!appt) throw new NotFoundException(`Appointment with id ${id} not found`);
    return appt;
  }

  async update(id: number, dto: UpdateAppointmentDto) {
    await this.findOne(id);
    return this.prisma.appointment.update({ where: { id }, data: dto });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.appointment.delete({ where: { id } });
  }
}
