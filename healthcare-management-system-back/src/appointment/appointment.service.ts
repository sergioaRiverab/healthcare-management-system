import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(private readonly prisma: PrismaService) {}

  //el status inicial debe estar en 'PENDING'
  async create(dto: CreateAppointmentDto) {
    // Validar que el paciente exista
    const patient = await this.prisma.patient.findUnique({
      where: { id: dto.patientId },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with id ${dto.patientId} not found`);
    }

    //validar que la pharmacy exista
    const pharmacy = await this.prisma.pharmacy.findUnique({
      where: { id: dto.pharmacyId },
    });
    if (!pharmacy) {
      throw new NotFoundException(`Pharmacy with id ${dto.pharmacyId} not found`);
    }

    //por defecto el status debe ser 'PENDING'
    dto.status = dto.status || 'PENDING';

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

    //appointments de un patient especifico

  async findAllByPatient(id: number) {
    const appt = await this.prisma.appointment.findMany({
      where: { patientId: id },
    });
    if (!appt) throw new NotFoundException(`No appointments found for patient with id ${id}`);
    return appt;
  }
}
